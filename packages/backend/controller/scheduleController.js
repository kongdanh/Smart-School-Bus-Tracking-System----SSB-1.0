// ============================================
// backend/controller/scheduleController.js
// ============================================

// Lấy tất cả lịch trình
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await prisma.lichtrinh.findMany({
            include: {
                tuyenduong: true,
                taixe: {
                    include: {
                        user: {
                            select: {
                                hoTen: true,
                                soDienThoai: true
                            }
                        }
                    }
                },
                xebuyt: true
            },
            orderBy: [
                { ngay: 'desc' },
                { gioKhoiHanh: 'asc' }
            ]
        });

        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        console.error('Get all schedules error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch trình'
        });
    }
};

// Lấy lịch trình theo ngày
exports.getSchedulesByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Ngày là bắt buộc'
            });
        }

        const schedules = await prisma.lichtrinh.findMany({
            where: {
                ngay: new Date(date)
            },
            include: {
                tuyenduong: true,
                taixe: {
                    include: {
                        user: true
                    }
                },
                xebuyt: true
            },
            orderBy: {
                gioKhoiHanh: 'asc'
            }
        });

        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        console.error('Get schedules by date error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch trình'
        });
    }
};

// Tạo lịch trình mới
exports.createSchedule = async (req, res) => {
    try {
        const { maLich, ngay, gioKhoiHanh, gioKetThuc, tuyenDuongId, taiXeId, xeBuytId } = req.body;

        if (!maLich || !ngay) {
            return res.status(400).json({
                success: false,
                message: 'Mã lịch và ngày là bắt buộc'
            });
        }

        const existingSchedule = await prisma.lichtrinh.findUnique({
            where: { maLich }
        });

        if (existingSchedule) {
            return res.status(400).json({
                success: false,
                message: 'Mã lịch đã tồn tại'
            });
        }

        const schedule = await prisma.lichtrinh.create({
            data: {
                maLich,
                ngay: new Date(ngay),
                gioKhoiHanh: gioKhoiHanh ? new Date(`1970-01-01T${gioKhoiHanh}`) : null,
                gioKetThuc: gioKetThuc ? new Date(`1970-01-01T${gioKetThuc}`) : null,
                tuyenDuongId: tuyenDuongId ? parseInt(tuyenDuongId) : null,
                taiXeId: taiXeId ? parseInt(taiXeId) : null,
                xeBuytId: xeBuytId ? parseInt(xeBuytId) : null
            },
            include: {
                tuyenduong: true,
                taixe: {
                    include: {
                        user: true
                    }
                },
                xebuyt: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Tạo lịch trình thành công',
            data: schedule
        });
    } catch (error) {
        console.error('Create schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo lịch trình'
        });
    }
};