// backend/controllers/attendanceController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy danh sách học sinh cần điểm danh theo lịch trình
exports.getStudentsBySchedule = async (req, res) => {
    try {
        const { lichTrinhId } = req.params;
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        const schedule = await prisma.lichtrinh.findUnique({
            where: { lichTrinhId: parseInt(lichTrinhId) },
            include: { tuyenduong: true, xebuyt: true }
        });

        if (!schedule || schedule.taiXeId !== taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập lịch trình này' });
        }

        const studentTrips = await prisma.studentTrip.findMany({
            where: { lichTrinhId: parseInt(lichTrinhId) },
            include: {
                hocsinh: {
                    include: {
                        phuhuynh: { include: { user: true } }
                    }
                }
            }
        });

        const attendances = await prisma.attendance.findMany({
            where: { lichTrinhId: parseInt(lichTrinhId), taiXeId: taiXeId }
        });

        const attendanceMap = {};
        attendances.forEach(att => { attendanceMap[att.hocSinhId] = att; });

        const students = studentTrips.map(st => ({
            hocSinhId: st.hocsinh.hocSinhId,
            maHS: st.hocsinh.maHS,
            hoTen: st.hocsinh.hoTen,
            lop: st.hocsinh.lop,
            diemDon: st.hocsinh.diemDon,
            diemTra: st.hocsinh.diemTra,
            soDienThoaiPH: st.hocsinh.soDienThoaiPH,
            avatar: st.hocsinh.avatar,
            attendance: attendanceMap[st.hocsinh.hocSinhId] || {
                loanDon: false, loanTra: false, thoiGianDon: null, thoiGianTra: null, ghiChu: ''
            }
        }));

        res.json({
            success: true,
            data: {
                schedule: {
                    lichTrinhId: schedule.lichTrinhId,
                    tuyenDuong: schedule.tuyenduong,
                    gioKhoiHanh: schedule.gioKhoiHanh,
                    gioKetThuc: schedule.gioKetThuc
                },
                students
            }
        });

    } catch (error) {
        console.error('Error getting students by schedule:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Điểm danh đón học sinh
exports.markPickup = async (req, res) => {
    try {
        const { lichTrinhId, hocSinhId } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        // 1. Update/Create Attendance
        const attendance = await prisma.attendance.upsert({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            update: {
                loanDon: true,
                thoiGianDon: new Date()
            },
            create: {
                lichTrinhId: parseInt(lichTrinhId),
                hocSinhId: parseInt(hocSinhId),
                taiXeId: taiXeId,
                loanDon: true,
                thoiGianDon: new Date()
            }
        });

        // 2. Update StudentTrip status
        await prisma.studentTrip.update({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            data: { trangThai: 'picked_up' }
        });

        // ============================================================
        // 3. TỰ ĐỘNG TẠO THÔNG BÁO CHO PHỤ HUYNH (TRIGGER NOTIFICATION)
        // ============================================================
        const studentInfo = await prisma.hocsinh.findUnique({
            where: { hocSinhId: parseInt(hocSinhId) },
            select: { hoTen: true, phuHuynhId: true }
        });

        if (studentInfo && studentInfo.phuHuynhId) {
            const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            await prisma.thongbao.create({
                data: {
                    phuHuynhId: studentInfo.phuHuynhId,
                    loai: 'pickup', // Khớp với switch case ở Frontend
                    noiDung: `Học sinh ${studentInfo.hoTen} đã được đón lên xe lúc ${timeString}.`,
                    thoiGianGui: new Date(),
                    daDoc: false
                }
            });
            console.log(`🔔 Notification created for Parent ID: ${studentInfo.phuHuynhId}`);
        }
        // ============================================================

        res.json({ success: true, data: attendance });

    } catch (error) {
        console.error('Error marking pickup:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Điểm danh trả học sinh
exports.markDropoff = async (req, res) => {
    try {
        const { lichTrinhId, hocSinhId } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });

        const existingAttendance = await prisma.attendance.findUnique({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            }
        });

        if (!existingAttendance || !existingAttendance.loanDon) {
            return res.status(400).json({ success: false, message: 'Phải đón học sinh trước khi trả' });
        }

        const attendance = await prisma.attendance.update({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            data: { loanTra: true, thoiGianTra: new Date() }
        });

        await prisma.studentTrip.update({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            data: { trangThai: 'completed' }
        });

        // (Option) Có thể thêm tạo thông báo "Đã trả học sinh" tại đây tương tự markPickup

        res.json({ success: true, data: attendance });

    } catch (error) {
        console.error('Error marking dropoff:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Hủy điểm danh đón
exports.unmarkPickup = async (req, res) => {
    try {
        const { lichTrinhId, hocSinhId } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;
        if (!taiXeId) return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });

        const attendance = await prisma.attendance.update({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            data: { loanDon: false, thoiGianDon: null, loanTra: false, thoiGianTra: null }
        });

        await prisma.studentTrip.update({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            data: { trangThai: 'pending' }
        });

        res.json({ success: true, data: attendance });
    } catch (error) {
        console.error('Error unmarking pickup:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Hủy điểm danh trả
exports.unmarkDropoff = async (req, res) => {
    try {
        const { lichTrinhId, hocSinhId } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;
        if (!taiXeId) return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });

        const attendance = await prisma.attendance.update({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            data: { loanTra: false, thoiGianTra: null }
        });

        res.json({ success: true, data: attendance });
    } catch (error) {
        console.error('Error unmarking dropoff:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Thêm ghi chú
exports.addNote = async (req, res) => {
    try {
        const { lichTrinhId, hocSinhId, ghiChu } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;
        if (!taiXeId) return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });

        const attendance = await prisma.attendance.upsert({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(lichTrinhId),
                    hocSinhId: parseInt(hocSinhId)
                }
            },
            update: { ghiChu: ghiChu },
            create: {
                lichTrinhId: parseInt(lichTrinhId),
                hocSinhId: parseInt(hocSinhId),
                taiXeId: taiXeId,
                ghiChu: ghiChu
            }
        });
        res.json({ success: true, data: attendance });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Điểm danh tất cả
exports.markAllPickup = async (req, res) => {
    try {
        const { lichTrinhId } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;
        if (!taiXeId) return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });

        const studentTrips = await prisma.studentTrip.findMany({
            where: { lichTrinhId: parseInt(lichTrinhId) }
        });

        const attendances = await Promise.all(
            studentTrips.map(st =>
                prisma.attendance.upsert({
                    where: {
                        lichTrinhId_hocSinhId: {
                            lichTrinhId: parseInt(lichTrinhId),
                            hocSinhId: st.hocSinhId
                        }
                    },
                    update: { loanDon: true, thoiGianDon: new Date() },
                    create: {
                        lichTrinhId: parseInt(lichTrinhId),
                        hocSinhId: st.hocSinhId,
                        taiXeId: taiXeId,
                        loanDon: true,
                        thoiGianDon: new Date()
                    }
                })
            )
        );

        await prisma.studentTrip.updateMany({
            where: { lichTrinhId: parseInt(lichTrinhId) },
            data: { trangThai: 'picked_up' }
        });

        res.json({ success: true, data: attendances });
    } catch (error) {
        console.error('Error marking all pickup:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Lấy báo cáo
exports.getAttendanceReport = async (req, res) => {
    try {
        const { lichTrinhId } = req.params;
        const attendances = await prisma.attendance.findMany({
            where: { lichTrinhId: parseInt(lichTrinhId) },
            include: { hocsinh: true, taixe: { include: { user: true } } }
        });

        const stats = {
            totalStudents: attendances.length,
            pickedUp: attendances.filter(a => a.loanDon).length,
            droppedOff: attendances.filter(a => a.loanTra).length,
            pending: attendances.filter(a => !a.loanDon).length
        };

        res.json({ success: true, data: { attendances, stats } });
    } catch (error) {
        console.error('Error getting attendance report:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};