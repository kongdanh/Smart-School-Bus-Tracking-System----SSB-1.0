// ============================================
// backend/controller/scheduleController.js
// ============================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy tất cả lịch trình
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await prisma.lichtrinh.findMany({
            include: {
                tuyenduong: {
                    include: {
                        tuyenduong_diemdung: {
                            include: {
                                diemdung: true
                            },
                            orderBy: {
                                thuTu: 'asc'
                            }
                        }
                    }
                },
                taixe: {
                    select: {
                        taiXeId: true,
                        hoTen: true,
                        soDienThoai: true,
                        trangThai: true
                    }
                },
                xebuyt: {
                    select: {
                        xeBuytId: true,
                        bienSo: true,
                        sucChua: true,
                        trangThai: true
                    }
                },
                studentTrips: {
                    include: {
                        hocsinh: {
                            select: {
                                hocSinhId: true,
                                hoTen: true,
                                maHS: true,
                                lop: true,
                                avatar: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { ngay: 'desc' },
                { gioKhoiHanh: 'asc' }
            ]
        });

        // Transform dữ liệu để dễ sử dụng ở frontend
        const transformedSchedules = schedules.map(schedule => ({
            ...schedule,
            tuyenduong: schedule.tuyenduong ? {
                ...schedule.tuyenduong,
                diemDung: schedule.tuyenduong.tuyenduong_diemdung.map(td => td.diemdung)
            } : null
        }));

        res.json({
            success: true,
            data: transformedSchedules
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

// Tạo lịch trình mới (Hỗ trợ tạo hàng loạt và gán học sinh)
exports.createSchedule = async (req, res) => {
    try {
        console.log('=== CreateSchedule API ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('User:', req.user);

        const {
            maLich,
            ngay,
            dates, // Mảng các ngày (cho lịch lặp lại)
            gioKhoiHanh,
            gioKetThuc,
            tuyenDuongId,
            taiXeId,
            xeBuytId,
            studentIds // Danh sách ID học sinh
        } = req.body;

        console.log('Extracted data:', {
            maLich, ngay, dates, gioKhoiHanh, gioKetThuc,
            tuyenDuongId, taiXeId, xeBuytId, studentIds
        });

        if (!maLich || (!ngay && (!dates || dates.length === 0))) {
            console.log('Validation failed: Missing maLich or dates');
            return res.status(400).json({
                success: false,
                message: 'Mã lịch và ngày là bắt buộc'
            });
        }

        const targetDates = dates && dates.length > 0 ? dates : [ngay];
        const createdSchedules = [];
        const errors = [];

        for (const dateStr of targetDates) {
            try {
                // Tạo mã lịch unique nếu tạo nhiều
                const uniqueCode = targetDates.length > 1
                    ? `${maLich}-${new Date(dateStr).toISOString().split('T')[0].replace(/-/g, '')}`
                    : maLich;

                // Kiểm tra trùng mã
                const existing = await prisma.lichtrinh.findUnique({ where: { maLich: uniqueCode } });
                if (existing) {
                    errors.push(`Lịch trình ${uniqueCode} đã tồn tại`);
                    continue;
                }

                const schedule = await prisma.lichtrinh.create({
                    data: {
                        maLich: uniqueCode,
                        ngay: new Date(dateStr),
                        gioKhoiHanh: gioKhoiHanh || '06:30',
                        gioKetThuc: gioKetThuc || '07:30',
                        tuyenDuongId: tuyenDuongId ? parseInt(tuyenDuongId) : null,
                        taiXeId: taiXeId ? parseInt(taiXeId) : null,
                        xeBuytId: xeBuytId ? parseInt(xeBuytId) : null,
                        trangThai: 'scheduled'
                    },
                    include: {
                        tuyenduong: true,
                        taixe: true,
                        xebuyt: true
                    }
                });

                // Create student trips separately if needed
                if (studentIds && studentIds.length > 0) {
                    await prisma.studentTrip.createMany({
                        data: studentIds.map(id => ({
                            lichTrinhId: schedule.lichTrinhId,
                            hocSinhId: parseInt(id),
                            ngayTao: new Date()
                        }))
                    });
                }
                createdSchedules.push(schedule);
            } catch (err) {
                console.error(`Error creating schedule for ${dateStr}:`, err);
                errors.push(`Lỗi tạo lịch ngày ${dateStr}`);
            }
        }

        if (createdSchedules.length === 0 && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể tạo lịch trình',
                errors
            });
        }

        res.status(201).json({
            success: true,
            message: `Đã tạo ${createdSchedules.length} lịch trình`,
            data: createdSchedules,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Create schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi tạo lịch trình'
        });
    }
};

// Thêm học sinh vào lịch trình
exports.assignStudentToSchedule = async (req, res) => {
    try {
        const { scheduleId, studentId } = req.params;

        // Kiểm tra học sinh tồn tại
        const student = await prisma.hocsinh.findUnique({
            where: { hocSinhId: parseInt(studentId) }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh'
            });
        }

        // Tạo bản ghi attendance cho học sinh
        // Cần lấy taiXeId từ lịch trình
        const schedule = await prisma.lichtrinh.findUnique({
            where: { lichTrinhId: parseInt(scheduleId) }
        });

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch trình'
            });
        }

        // Tạo hoặc cập nhật attendance record
        const attendance = await prisma.attendance.upsert({
            where: {
                lichTrinhId_hocSinhId: {
                    lichTrinhId: parseInt(scheduleId),
                    hocSinhId: parseInt(studentId)
                }
            },
            update: {},
            create: {
                lichTrinhId: parseInt(scheduleId),
                hocSinhId: parseInt(studentId),
                taiXeId: schedule.taiXeId || 1  // Default taiXeId nếu không có
            }
        });

        res.status(201).json({
            success: true,
            message: 'Thêm học sinh vào lịch trình thành công',
            data: attendance
        });
    } catch (error) {
        console.error('Assign student to schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm học sinh vào lịch trình'
        });
    }
};

// Cập nhật lịch trình (Gán tài xế, xe buýt)
exports.updateSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const {
            maLich,
            ngay,
            gioKhoiHanh,
            gioKetThuc,
            tuyenDuongId,
            taiXeId,
            xeBuytId,
            studentIds,
            trangThai,
            ghiChu
        } = req.body;

        // Update schedule basic info
        const updatedSchedule = await prisma.lichtrinh.update({
            where: { lichTrinhId: parseInt(scheduleId) },
            data: {
                ...(maLich && { maLich }),
                ...(ngay && { ngay: new Date(ngay) }),
                ...(gioKhoiHanh && { gioKhoiHanh }),
                ...(gioKetThuc && { gioKetThuc }),
                ...(tuyenDuongId && { tuyenDuongId: parseInt(tuyenDuongId) }),
                ...(taiXeId && { taiXeId: parseInt(taiXeId) }),
                ...(xeBuytId && { xeBuytId: parseInt(xeBuytId) }),
                ...(trangThai && { trangThai }),
                ...(ghiChu && { ghiChu })
            },
            include: {
                taixe: true,
                xebuyt: true,
                tuyenduong: true,
                studentTrips: {
                    include: {
                        hocsinh: true
                    }
                }
            }
        });

        // Update student assignments if provided
        if (Array.isArray(studentIds)) {
            // Delete existing student trips
            await prisma.studentTrip.deleteMany({
                where: { lichTrinhId: parseInt(scheduleId) }
            });

            // Create new student trips
            if (studentIds.length > 0) {
                const studentTrips = studentIds.map(studentId => ({
                    lichTrinhId: parseInt(scheduleId),
                    hocSinhId: parseInt(studentId),
                    ngayTao: new Date()
                }));

                await prisma.studentTrip.createMany({
                    data: studentTrips
                });
            }
        }

        res.json({
            success: true,
            message: 'Cập nhật lịch trình thành công',
            data: updatedSchedule
        });
    } catch (error) {
        console.error('Update schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật lịch trình',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};