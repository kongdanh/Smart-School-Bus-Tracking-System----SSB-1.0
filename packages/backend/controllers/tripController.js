const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Bắt đầu chuyến xe (Tương ứng hành động Check-in Vào Ca)
exports.startTrip = async (req, res) => {
    try {
        const { lichTrinhId } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        // Kiểm tra lịch trình
        const schedule = await prisma.lichtrinh.findUnique({
            where: { lichTrinhId: parseInt(lichTrinhId) }
        });

        if (!schedule || schedule.taiXeId !== taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập lịch trình này' });
        }

        // Tạo trip record
        const tripRecord = await prisma.tripRecord.create({
            data: {
                lichTrinhId: parseInt(lichTrinhId),
                taiXeId: taiXeId,
                thoiGianKD: new Date()
            }
        });

        // Cập nhật trạng thái lịch trình
        await prisma.lichtrinh.update({
            where: { lichTrinhId: parseInt(lichTrinhId) },
            data: { trangThai: 'in_progress' }
        });

        res.json({ success: true, data: tripRecord });

    } catch (error) {
        console.error('Error starting trip:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Kết thúc chuyến xe (Tương ứng hành động Check-out Ra Ca)
exports.endTrip = async (req, res) => {
    try {
        const { tripRecordId, soKmDiDuoc } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        // Lấy trip record
        const tripRecord = await prisma.tripRecord.findUnique({
            where: { tripRecordId: parseInt(tripRecordId) },
            include: { lichtrinh: true }
        });

        if (!tripRecord || tripRecord.taiXeId !== taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        // Đếm số học sinh đã đón
        const attendanceCount = await prisma.attendance.count({
            where: {
                lichTrinhId: tripRecord.lichTrinhId,
                loanDon: true
            }
        });

        // Cập nhật trip record
        const updatedTrip = await prisma.tripRecord.update({
            where: { tripRecordId: parseInt(tripRecordId) },
            data: {
                thoiGianKT: new Date(),
                soKmDiDuoc: parseFloat(soKmDiDuoc) || 0,
                tongHocSinh: attendanceCount
            }
        });

        // Cập nhật trạng thái lịch trình
        await prisma.lichtrinh.update({
            where: { lichTrinhId: tripRecord.lichTrinhId },
            data: { trangThai: 'completed' }
        });

        // ✅ CLEAR ATTENDANCE STATUS: Reset lại trạng thái của tất cả học sinh để chuẩn bị cho chuyến tiếp theo
        await prisma.attendance.updateMany({
            where: { lichTrinhId: tripRecord.lichTrinhId },
            data: {
                loanDon: false,        // Reset: Chưa đón
                loanTra: false,        // Reset: Chưa trả
                thoiGianDon: null,     // Xoá thời gian đón
                thoiGianTra: null,     // Xoá thời gian trả
                ghiChu: ''             // Xoá ghi chú
            }
        });

        // ✅ RESET STUDENT TRIP STATUS: Đặt lại trạng thái học sinh thành 'pending'
        await prisma.studentTrip.updateMany({
            where: { lichTrinhId: tripRecord.lichTrinhId },
            data: { trangThai: 'pending' }
        });

        // Cập nhật số chuyến hoàn thành của tài xế
        await prisma.taixe.update({
            where: { taiXeId: taiXeId },
            data: {
                soChuyenHT: {
                    increment: 1
                }
            }
        });

        res.json({ success: true, data: updatedTrip, message: '✅ Chuyến xe hoàn thành! Dữ liệu đã reset cho chuyến tiếp theo.' });

    } catch (error) {
        console.error('Error ending trip:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Báo cáo sự cố
exports.reportIncident = async (req, res) => {
    try {
        const { tripRecordId, moTaSuCo } = req.body;
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        const updatedTrip = await prisma.tripRecord.update({
            where: { tripRecordId: parseInt(tripRecordId) },
            data: {
                suCo: true,
                moTaSuCo: moTaSuCo
            }
        });

        res.json({ success: true, data: updatedTrip });

    } catch (error) {
        console.error('Error reporting incident:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Lấy Dashboard cho Tài xế (Thay thế getCurrentTrip cũ)
// Hàm này trả về: Info tài xế, Info xe, Lịch trình hôm nay, và Chuyến đang chạy (nếu có)
exports.getDriverDashboard = async (req, res) => {
    try {
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        // 1. Lấy thông tin tài xế
        const driverInfo = await prisma.taixe.findUnique({
            where: { taiXeId: taiXeId },
            include: { user: { select: { avatar: true, email: true } } }
        });

        // 2. Lấy tất cả lịch trình HÔM NAY của tài xế
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const todaySchedules = await prisma.lichtrinh.findMany({
            where: {
                taiXeId: taiXeId,
                ngay: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                tuyenduong: true,
                xebuyt: true,
                tripRecords: {
                    where: { taiXeId: taiXeId }
                }
            },
            orderBy: { gioKhoiHanh: 'asc' }
        });

        // 3. Tìm chuyến đang chạy (in_progress) để UI biết mà hiển thị trạng thái "Đã Check-in"
        const currentTrip = todaySchedules.find(s => s.trangThai === 'in_progress');

        // 4. Lấy thông tin xe (ưu tiên từ chuyến đang chạy, nếu không thì lấy từ chuyến đầu tiên trong ngày)
        const busInfo = currentTrip?.xebuyt || (todaySchedules.length > 0 ? todaySchedules[0].xebuyt : null);

        res.json({
            success: true,
            data: {
                driver: driverInfo,
                bus: busInfo,
                schedules: todaySchedules,
                currentTrip: currentTrip || null,
                // Nếu đang chạy thì trả về ID bản ghi để lúc End Trip biết cái nào mà update
                tripRecordId: currentTrip && currentTrip.tripRecords.length > 0
                    ? currentTrip.tripRecords[0].tripRecordId
                    : null
            }
        });

    } catch (error) {
        console.error('Error getting driver dashboard:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Lấy lịch sử chuyến xe
exports.getTripHistory = async (req, res) => {
    try {
        const taiXeId = req.user.taixe?.taiXeId;
        const { page = 1, limit = 10 } = req.query;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [trips, total] = await Promise.all([
            prisma.tripRecord.findMany({
                where: { taiXeId: taiXeId },
                include: {
                    lichtrinh: {
                        include: {
                            tuyenduong: true,
                            xebuyt: true
                        }
                    }
                },
                orderBy: {
                    thoiGianKD: 'desc'
                },
                skip: skip,
                take: parseInt(limit)
            }),
            prisma.tripRecord.count({
                where: { taiXeId: taiXeId }
            })
        ]);

        res.json({
            success: true,
            data: {
                trips,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Error getting trip history:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Lấy chi tiết chuyến xe
exports.getTripDetail = async (req, res) => {
    try {
        const { tripRecordId } = req.params;
        const taiXeId = req.user.taixe?.taiXeId;

        const trip = await prisma.tripRecord.findUnique({
            where: { tripRecordId: parseInt(tripRecordId) },
            include: {
                lichtrinh: {
                    include: {
                        tuyenduong: true,
                        xebuyt: true,
                        attendance: {
                            include: {
                                hocsinh: true
                            }
                        }
                    }
                }
            }
        });

        if (!trip || trip.taiXeId !== taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        res.json({ success: true, data: trip });

    } catch (error) {
        console.error('Error getting trip detail:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật số km đã đi
exports.updateDistance = async (req, res) => {
    try {
        const { tripRecordId, soKmDiDuoc } = req.body;
        const updatedTrip = await prisma.tripRecord.update({
            where: { tripRecordId: parseInt(tripRecordId) },
            data: { soKmDiDuoc: parseFloat(soKmDiDuoc) }
        });
        res.json({ success: true, data: updatedTrip });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};