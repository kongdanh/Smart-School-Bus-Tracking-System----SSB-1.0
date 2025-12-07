require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const UPDATE_INTERVAL = 2000; // Tăng tốc độ cập nhật (2s/lần)
const STEP_SIZE = 4; // Tăng bước nhảy để đạt tốc độ ~40km/h
const JUMP_AFTER_STOP = 40;
const BUS_ID = 1;
const DRIVER_ID = 1; // ID tài xế cần giả lập (Nguyễn Văn A)
// const LICH_TRINH_ID = 4; // REMOVED HARDCODED ID
const API_URL = 'http://localhost:5000/api'; // URL Backend

async function getActiveSchedule() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Ưu tiên tìm lịch trình đang chạy (in_progress) của TÀI XẾ này
    let schedule = await prisma.lichtrinh.findFirst({
        where: {
            taiXeId: DRIVER_ID, // Ưu tiên theo tài xế
            trangThai: 'in_progress',
            ngay: { gte: today, lt: tomorrow }
        },
        orderBy: { ngay: 'desc' }
    });

    // 2. Nếu không có, tìm lịch trình sắp chạy (scheduled) của TÀI XẾ này
    if (!schedule) {
        schedule = await prisma.lichtrinh.findFirst({
            where: {
                taiXeId: DRIVER_ID,
                trangThai: 'scheduled',
                ngay: { gte: today, lt: tomorrow }
            },
            orderBy: { ngay: 'asc' }
        });
    }

    // 3. Fallback: Tìm theo BUS_ID nếu không tìm thấy theo tài xế (Logic cũ)
    if (!schedule) {
        console.log(`⚠️ Không tìm thấy lịch trình cho Tài xế ${DRIVER_ID}, thử tìm theo Xe ${BUS_ID}...`);
        schedule = await prisma.lichtrinh.findFirst({
            where: {
                xeBuytId: BUS_ID,
                trangThai: 'in_progress',
                ngay: { gte: today, lt: tomorrow }
            },
            orderBy: { ngay: 'desc' }
        });
    }

    return schedule ? { id: schedule.lichTrinhId, busId: schedule.xeBuytId } : null;
}

async function getRealRouteFromOSRM(waypoints) {
    try {
        const coordString = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
        // console.log("🌍 Đang tải lộ trình OSRM...");
        const response = await axios.get(url);
        if (response.data.routes && response.data.routes.length > 0) {
            const coordinates = response.data.routes[0].geometry.coordinates;
            return coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
        }
    } catch (error) {
        console.error("❌ Lỗi OSRM:", error.message);
    }
    return null;
}

async function checkWaitingLogic(stopIndex, majorStops, elapsedTime, lichTrinhId) {
    // 1. Nếu là trạm cuối (Về trường) -> Chỉ cần đợi 5s trả khách rồi kết thúc
    if (stopIndex === majorStops.length - 1) {
        if (elapsedTime > 5000) {
            console.log("Đã trả học sinh xong. Kết thúc hành trình!");
            return true;
        }
        if (elapsedTime % 2000 < 500) console.log("⏳ Đang trả học sinh tại trường...");
        return false;
    }

    if (elapsedTime >= 60000) {
        console.log(`Hết giờ chờ (60s)! Xe buộc phải rời trạm ${majorStops[stopIndex].name}`);
        return true;
    }

    // 3. CHECK DATABASE ĐỂ XEM ĐÓN XONG CHƯA
    try {
        // REMOVED: Old query that fetched all students

        // 3. CHECK DATABASE ĐỂ XEM ĐÓN XONG CHƯA
        // Logic mới: Tìm học sinh có diemDon trùng với tên trạm hiện tại
        // Lưu ý: Cần đảm bảo tên trạm trong DB (diemdung.tenDiemDung) khớp với hocsinh.diemDon
        // Hoặc dùng logic chia đều tạm thời nếu dữ liệu chưa chuẩn

        // Lấy tên trạm hiện tại
        const currentStopName = majorStops[stopIndex].name;

        // Lấy danh sách học sinh cần đón tại trạm này
        // Cần join với bảng hocsinh để lấy diemDon
        const studentsAtStop = await prisma.attendance.findMany({
            where: {
                lichTrinhId: lichTrinhId,
                hocsinh: {
                    diemDon: currentStopName // Match tên trạm
                }
            },
            include: {
                hocsinh: true
            }
        });

        // Nếu không tìm thấy học sinh nào theo tên trạm, fallback về logic chia đều cũ (để tránh kẹt xe mãi mãi nếu data lệch)
        let targetStudents = [];
        if (studentsAtStop.length > 0) {
            targetStudents = studentsAtStop;
        } else {
            // Fallback logic cũ
            const allStudents = await prisma.attendance.findMany({
                where: { lichTrinhId: lichTrinhId },
                orderBy: { hocSinhId: 'asc' }
            });

            if (!allStudents || allStudents.length === 0) return true; // Không có ai để đón

            const pickupStopsCount = Math.max(1, majorStops.length - 1);
            const studentsPerStop = Math.ceil(allStudents.length / pickupStopsCount);
            const currentPickupIdx = stopIndex - 1; // Trừ điểm xuất phát

            if (currentPickupIdx < 0) return true; // Điểm xuất phát không đón ai (hoặc tùy logic)

            const startIdx = currentPickupIdx * studentsPerStop;
            const endIdx = startIdx + studentsPerStop;
            targetStudents = allStudents.slice(startIdx, endIdx);
        }

        if (targetStudents.length === 0) return true;

        const pendingStudents = targetStudents.filter(s => !s.loanDon);

        if (pendingStudents.length === 0) {
            console.log(`✅ Đã đón đủ ${targetStudents.length} học sinh tại ${currentStopName}!`);
            return true;
        } else {
            if (elapsedTime % 5000 < 1000) {
                console.log(`⏳ Đang chờ ${pendingStudents.length}/${targetStudents.length} học sinh tại ${currentStopName}...`);
            }
            return false;
        }

    } catch (err) {
        console.error(" Lỗi check DB:", err.message);
        return true;
    }
}

async function runBus() {
    console.log(`🚀 XE BUS ${BUS_ID} BẮT ĐẦU CHẠY...`);

    const scheduleInfo = await getActiveSchedule();
    if (!scheduleInfo) {
        console.error("❌ Không tìm thấy lịch trình nào cho xe bus này hôm nay!");
        return;
    }
    const { id: LICH_TRINH_ID, busId: ACTIVE_BUS_ID } = scheduleInfo;
    console.log(`📌 Đang chạy lịch trình ID: ${LICH_TRINH_ID} trên Xe Bus ID: ${ACTIVE_BUS_ID}`);

    // 1. Cập nhật trạng thái lịch trình thành 'in_progress' để App Phụ huynh tìm thấy
    try {
        await prisma.lichtrinh.update({
            where: { lichTrinhId: LICH_TRINH_ID },
            data: { trangThai: 'in_progress' }
        });
        console.log("✅ Đã cập nhật trạng thái lịch trình: in_progress");
    } catch (e) {
        console.error("⚠️ Không thể cập nhật trạng thái lịch trình:", e.message);
    }

    // 2. Lấy lộ trình thực tế từ Database
    let majorStops = [];
    try {
        const schedule = await prisma.lichtrinh.findUnique({
            where: { lichTrinhId: LICH_TRINH_ID },
            include: {
                tuyenduong: {
                    include: {
                        tuyenduong_diemdung: {
                            include: { diemdung: true },
                            orderBy: { thuTu: 'asc' }
                        }
                    }
                }
            }
        });

        if (schedule && schedule.tuyenduong && schedule.tuyenduong.tuyenduong_diemdung.length > 0) {
            const dbStops = schedule.tuyenduong.tuyenduong_diemdung.map(td => ({
                lat: parseFloat(td.diemdung.vido),
                lng: parseFloat(td.diemdung.kinhdo),
                name: td.diemdung.tenDiemDung
            }));

            // Sử dụng chính xác các điểm dừng từ Database
            // Thêm điểm xuất phát (Trường) và kết thúc (Trường) để tạo vòng khép kín
            const SCHOOL_LOC = { lat: 10.762622, lng: 106.682228, name: "Trường (Xuất phát)" };
            const SCHOOL_END = { lat: 10.762622, lng: 106.682228, name: "Trường (Về đích)" };

            // Nếu điểm đầu tiên trong DB không phải là trường, thêm trường vào đầu
            // Nếu điểm cuối cùng trong DB không phải là trường, thêm trường vào cuối

            let finalStops = [...dbStops];

            // Kiểm tra xem có cần thêm trường vào đầu không (nếu điểm đầu cách trường > 100m)
            const distToSchoolStart = Math.sqrt(Math.pow(dbStops[0].lat - SCHOOL_LOC.lat, 2) + Math.pow(dbStops[0].lng - SCHOOL_LOC.lng, 2));
            if (distToSchoolStart > 0.001) {
                finalStops = [SCHOOL_LOC, ...finalStops];
            }

            // Kiểm tra xem có cần thêm trường vào cuối không
            const lastStop = dbStops[dbStops.length - 1];
            const distToSchoolEnd = Math.sqrt(Math.pow(lastStop.lat - SCHOOL_END.lat, 2) + Math.pow(lastStop.lng - SCHOOL_END.lng, 2));
            if (distToSchoolEnd > 0.001) {
                finalStops = [...finalStops, SCHOOL_END];
            }

            majorStops = finalStops;
            console.log(`✅ Đã tải ${dbStops.length} điểm dừng từ Database.`);
            console.log("📋 Danh sách điểm dừng:", majorStops.map(s => s.name).join(" -> "));
        } else {
            console.warn("⚠️ Không tìm thấy điểm dừng trong DB, dùng lộ trình mẫu.");
            majorStops = [
                { lat: 10.762622, lng: 106.682228, name: "Trường LHP (Xuất phát)" },
                { lat: 10.772542, lng: 106.698021, name: "Chợ Bến Thành" },
                { lat: 10.779785, lng: 106.699018, name: "Nhà Thờ Đức Bà" },
                { lat: 10.787602, lng: 106.705139, name: "Thảo Cầm Viên" },
                { lat: 10.794939, lng: 106.721773, name: "Landmark 81" },
                { lat: 10.762622, lng: 106.682228, name: "Trường LHP (Về đích)" }
            ];
        }
    } catch (error) {
        console.error("❌ Lỗi lấy lộ trình từ DB:", error);
        return;
    }

    let realPath = await getRealRouteFromOSRM(majorStops);
    if (!realPath || realPath.length === 0) {
        console.log("⚠️ Lỗi mạng, không tải được đường.");
        return;
    }
    console.log(` Lộ trình tải xong: ${realPath.length} điểm.`);

    let currentIndex = 0;
    let isPaused = false;
    let pauseStartTime = 0;
    let currentStopIdx = -1;
    let lastVisitedStopIdx = -1;

    setInterval(async () => {
        if (isPaused) {
            const elapsedTime = Date.now() - pauseStartTime;

            const canGo = await checkWaitingLogic(currentStopIdx, majorStops, elapsedTime, LICH_TRINH_ID);

            if (canGo) {
                console.log(`Rời trạm ${majorStops[currentStopIdx].name}...`);
                isPaused = false;
                lastVisitedStopIdx = currentStopIdx;
                currentIndex += JUMP_AFTER_STOP;
            }
            return;
        }

        // --- B. NẾU ĐANG DI CHUYỂN ---
        if (currentIndex >= realPath.length) {
            console.log("🔄 Hết vòng, quay lại từ đầu...");
            currentIndex = 0;
            lastVisitedStopIdx = -1;
            return;
        }

        const point = realPath[currentIndex];

        // Check trạm dừng
        const STOP_TOLERANCE = 0.0015;
        for (let i = 0; i < majorStops.length; i++) {
            if (i === 0) continue;
            if (i === lastVisitedStopIdx) continue;
            if (i === majorStops.length - 1 && currentIndex < realPath.length * 0.8) continue;

            const stop = majorStops[i];
            const distLat = Math.abs(point.lat - stop.lat);
            const distLng = Math.abs(point.lng - stop.lng);

            if (distLat < STOP_TOLERANCE && distLng < STOP_TOLERANCE) {
                console.log(` DỪNG TẠI: ${stop.name}`);
                isPaused = true;
                pauseStartTime = Date.now();
                currentStopIdx = i;
                point.lat = stop.lat;
                point.lng = stop.lng;
                break;
            }
        }

        // --- C. GHI DB & DI CHUYỂN ---
        try {
            // GỌI API THAY VÌ GHI TRỰC TIẾP DB ĐỂ BACKEND EMIT SOCKET
            // URL: /api/location/update/:busId (Public route)
            await axios.post(`${API_URL}/location/update/${ACTIVE_BUS_ID}`, {
                vido: point.lat,
                kinhdo: point.lng
            });

            const percent = Math.round((currentIndex / realPath.length) * 100);
            // GIẢM LOG: Chỉ log mỗi 20% thay vì 10% và kiểm tra kỹ hơn
            if (percent % 20 === 0 && currentIndex % 50 === 0) {
                console.log(`🚌 Bus tại [${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}] - ${percent}%`);
            }

        } catch (err) {
            console.error("❌ Lỗi gọi API cập nhật vị trí:", err.message);
            if (err.code === 'ECONNREFUSED') {
                console.error("   ⚠️ Không thể kết nối đến Backend. Hãy kiểm tra server đang chạy tại " + API_URL);
            }
            if (err.response) {
                console.error("   Status:", err.response.status);
                console.error("   Data:", err.response.data);
            }
        } finally {
            currentIndex += STEP_SIZE;
        }

    }, UPDATE_INTERVAL);
}

runBus();