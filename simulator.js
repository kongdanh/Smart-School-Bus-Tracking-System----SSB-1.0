require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

// --- CẤU HÌNH ---
const UPDATE_INTERVAL = 2000; // 2 giây cập nhật 1 lần
const STEP_SIZE = 5;          // Tốc độ di chuyển
const JUMP_AFTER_STOP = 20;   // Nhảy cóc để thoát vùng trạm
const BUS_ID = 1;             // ID Xe
const LICH_TRINH_ID = 4;      // ID Chuyến đi hiện tại (Quan trọng để check học sinh)

async function getRealRouteFromOSRM(waypoints) {
    try {
        const coordString = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
        console.log("🌍 Đang tải lộ trình OSRM...");
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

// --- LOGIC KIỂM TRA ĐÓN HỌC SINH (QUAN TRỌNG) ---
async function checkWaitingLogic(stopIndex, majorStops, elapsedTime) {
    // 1. Nếu là trạm cuối (Về trường) -> Chỉ cần đợi 5s trả khách rồi kết thúc
    if (stopIndex === majorStops.length - 1) {
        if (elapsedTime > 5000) {
            console.log("🏫 Đã trả học sinh xong. Kết thúc hành trình!");
            return true;
        }
        if (elapsedTime % 2000 < 500) console.log("⏳ Đang trả học sinh tại trường...");
        return false;
    }

    // 2. QUY TẮC 60 GIÂY: Nếu chờ quá 60s -> Buộc phải đi
    if (elapsedTime >= 60000) {
        console.log(`⏰ Hết giờ chờ (60s)! Xe buộc phải rời trạm ${majorStops[stopIndex].name}`);
        return true;
    }

    // 3. CHECK DATABASE ĐỂ XEM ĐÓN XONG CHƯA
    try {
        // Lấy danh sách học sinh của chuyến này
        const allStudents = await prisma.attendance.findMany({
            where: { lichTrinhId: LICH_TRINH_ID },
            orderBy: { hocSinhId: 'asc' } // Sắp xếp để khớp với logic chia trạm
        });

        // Nếu không có học sinh nào trong DB -> Đi luôn (đợi 3s cho có lệ)
        if (!allStudents || allStudents.length === 0) {
            if (elapsedTime > 3000) return true;
            return false;
        }

        // --- LOGIC CHIA HỌC SINH VỀ CÁC TRẠM (Khớp với Frontend) ---
        // Tổng trạm đón = Tổng trạm - 1 (điểm đầu) - 1 (điểm cuối) ? 
        // Logic của bạn: Trạm 0 (LHP đi) không đón, Trạm 5 (LHP về) trả. 
        // Vậy các trạm đón là index: 1, 2, 3, 4. Tổng cộng 4 trạm.
        const pickupStopsCount = majorStops.length - 2;
        const studentsPerStop = Math.ceil(allStudents.length / pickupStopsCount);

        // Tính toán xem trạm hiện tại (stopIndex) phụ trách những em nào
        // stopIndex = 1 (Bến Thành) -> là trạm đón thứ 1 (index 0 trong logic chia)
        const currentPickupIdx = stopIndex - 1;

        const startIdx = currentPickupIdx * studentsPerStop;
        const endIdx = startIdx + studentsPerStop;
        const studentsAtThisStop = allStudents.slice(startIdx, endIdx);

        // Nếu trạm này không có học sinh (do chia lẻ) -> Đi luôn
        if (studentsAtThisStop.length === 0) return true;

        // Kiểm tra xem TẤT CẢ học sinh tại trạm này đã có loanDon = true chưa
        const pendingStudents = studentsAtThisStop.filter(s => !s.loanDon);

        if (pendingStudents.length === 0) {
            console.log(`✅ Đã đón đủ ${studentsAtThisStop.length} học sinh tại ${majorStops[stopIndex].name}!`);
            return true; // Đi tiếp
        } else {
            // Chỉ log mỗi 2 giây để đỡ spam
            if (elapsedTime % 2000 < 200) {
                console.log(`⏳ Đang chờ ${pendingStudents.length}/${studentsAtThisStop.length} học sinh... (${Math.round(elapsedTime / 1000)}s)`);
            }
            return false; // Vẫn đợi
        }

    } catch (err) {
        console.error("⚠️ Lỗi check DB:", err.message);
        return true; // Lỗi thì cho đi luôn để không kẹt
    }
}

async function runBus() {
    console.log(`🚀 XE BUS ${BUS_ID} BẮT ĐẦU CHẠY...`);

    const majorStops = [
        { lat: 10.762622, lng: 106.682228, name: "Trường LHP (Xuất phát)" }, // 0
        { lat: 10.772542, lng: 106.698021, name: "Chợ Bến Thành" }, // 1
        { lat: 10.779785, lng: 106.699018, name: "Nhà Thờ Đức Bà" }, // 2
        { lat: 10.787602, lng: 106.705139, name: "Thảo Cầm Viên" }, // 3
        { lat: 10.794939, lng: 106.721773, name: "Landmark 81" }, // 4
        { lat: 10.762622, lng: 106.682228, name: "Trường LHP (Về đích)" } // 5
    ];

    let realPath = await getRealRouteFromOSRM(majorStops);
    if (!realPath || realPath.length === 0) {
        console.log("⚠️ Lỗi mạng, không tải được đường.");
        return;
    }
    console.log(`✅ Lộ trình tải xong: ${realPath.length} điểm.`);

    let currentIndex = 0;
    let isPaused = false;
    let pauseStartTime = 0;
    let currentStopIdx = -1;
    let lastVisitedStopIdx = -1;

    setInterval(async () => {
        // --- A. NẾU ĐANG DỪNG TRẠM ---
        if (isPaused) {
            const elapsedTime = Date.now() - pauseStartTime;

            // Gọi hàm check thông minh
            const canGo = await checkWaitingLogic(currentStopIdx, majorStops, elapsedTime);

            if (canGo) {
                console.log(`▶️ Rời trạm ${majorStops[currentStopIdx].name}...`);
                isPaused = false;
                lastVisitedStopIdx = currentStopIdx;
                currentIndex += JUMP_AFTER_STOP; // Nhảy để thoát trạm
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
            // Fix lỗi nhận nhầm điểm đích khi mới xuất phát
            if (i === majorStops.length - 1 && currentIndex < realPath.length * 0.8) continue;

            const stop = majorStops[i];
            const distLat = Math.abs(point.lat - stop.lat);
            const distLng = Math.abs(point.lng - stop.lng);

            if (distLat < STOP_TOLERANCE && distLng < STOP_TOLERANCE) {
                console.log(`🛑 DỪNG TẠI: ${stop.name}`);
                isPaused = true;
                pauseStartTime = Date.now();
                currentStopIdx = i;
                point.lat = stop.lat; // Neo vị trí cho đẹp
                point.lng = stop.lng;
                break;
            }
        }

        // --- C. GHI DB & DI CHUYỂN ---
        try {
            await prisma.vitri.create({
                data: {
                    xeBuytId: BUS_ID,
                    vido: point.lat,
                    kinhdo: point.lng,
                    thoiGian: new Date()
                }
            });

            const percent = Math.round((currentIndex / realPath.length) * 100);
            if (percent % 10 === 0 && currentIndex % 20 === 0) {
                console.log(`🚌 Bus tại [${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}] - ${percent}%`);
            }

        } catch (err) {
            // Lỗi DB thì bỏ qua, xe vẫn chạy
        } finally {
            currentIndex += STEP_SIZE;
        }

    }, UPDATE_INTERVAL);
}

runBus();