// backend/controllers/tripController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Bắt đầu chuyến xe
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

// Kết thúc chuyến xe
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

        // Cập nhật số chuyến hoàn thành của tài xế
        await prisma.taixe.update({
            where: { taiXeId: taiXeId },
            data: {
                soChuyenHT: {
                    increment: 1
                }
            }
        });

        res.json({ success: true, data: updatedTrip });

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

        const tripRecord = await prisma.tripRecord.findUnique({
            where: { tripRecordId: parseInt(tripRecordId) }
        });

        if (!tripRecord || tripRecord.taiXeId !== taiXeId) {
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

// Lấy chuyến xe hiện tại của tài xế
exports.getCurrentTrip = async (req, res) => {
    try {
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        // Tìm chuyến xe đang in_progress
        const currentSchedule = await prisma.lichtrinh.findFirst({
            where: {
                taiXeId: taiXeId,
                trangThai: 'in_progress',
                ngay: {
                    equals: new Date(new Date().setHours(0, 0, 0, 0))
                }
            },
            include: {
                tuyenduong: true,
                xebuyt: true,
                tripRecords: {
                    where: {
                        taiXeId: taiXeId,
                        thoiGianKT: null
                    },
                    orderBy: {
                        thoiGianKD: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!currentSchedule) {
            return res.json({ success: true, data: null });
        }

        res.json({
            success: true,
            data: {
                schedule: currentSchedule,
                tripRecord: currentSchedule.tripRecords[0] || null
            }
        });

    } catch (error) {
        console.error('Error getting current trip:', error);
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

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

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
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        const trip = await prisma.tripRecord.findUnique({
            where: { tripRecordId: parseInt(tripRecordId) }
        });

        if (!trip || trip.taiXeId !== taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        const updatedTrip = await prisma.tripRecord.update({
            where: { tripRecordId: parseInt(tripRecordId) },
            data: {
                soKmDiDuoc: parseFloat(soKmDiDuoc)
            }
        });

        res.json({ success: true, data: updatedTrip });

    } catch (error) {
        console.error('Error updating distance:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};