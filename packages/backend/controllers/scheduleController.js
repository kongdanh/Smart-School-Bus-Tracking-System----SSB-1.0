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

// Helper để parse time string "HH:mm" thành Date object
const parseTime = (timeStr) => {
    if (!timeStr) return undefined;
    if (timeStr instanceof Date) return timeStr;

    // Nếu là ISO string
    if (timeStr.includes('T')) return new Date(timeStr);

    // Nếu là "HH:mm" hoặc "HH:mm:ss"
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
};

// Tạo lịch trình mới (Hỗ trợ tạo hàng loạt và gán học sinh)
exports.createSchedule = async (req, res) => {
    try {
        console.log('=== CreateSchedule API ===');

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

        // Validation cơ bản
        if (!maLich || (!ngay && (!dates || dates.length === 0))) {
            return res.status(400).json({
                success: false,
                message: 'Mã lịch và ngày là bắt buộc'
            });
        }

        const targetDates = dates && dates.length > 0 ? dates : [ngay];
        const createdSchedules = [];
        const errors = [];

        // Xử lý từng ngày trong transaction để đảm bảo tính toàn vẹn
        for (const dateStr of targetDates) {
            try {
                await prisma.$transaction(async (tx) => {
                    // 1. Tạo mã lịch unique
                    const uniqueCode = targetDates.length > 1
                        ? `${maLich}-${new Date(dateStr).toISOString().split('T')[0].replace(/-/g, '')}`
                        : maLich;

                    // Kiểm tra trùng mã (trong transaction)
                    const existing = await tx.lichtrinh.findUnique({ where: { maLich: uniqueCode } });
                    const finalCode = existing ? `${uniqueCode}-${Date.now()}` : uniqueCode;

                    // 2. Tạo lịch trình
                    const schedule = await tx.lichtrinh.create({
                        data: {
                            maLich: finalCode,
                            ngay: new Date(dateStr),
                            gioKhoiHanh: parseTime(gioKhoiHanh) || parseTime('06:30'),
                            gioKetThuc: parseTime(gioKetThuc) || parseTime('07:30'),
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

                    // 3. Tạo danh sách học sinh đi theo lịch (nếu có)
                    if (studentIds && studentIds.length > 0) {
                        // Lọc bỏ các ID không hợp lệ hoặc trùng lặp
                        const uniqueStudentIds = [...new Set(studentIds)].map(id => parseInt(id)).filter(id => !isNaN(id));

                        if (uniqueStudentIds.length > 0) {
                            await tx.studentTrip.createMany({
                                data: uniqueStudentIds.map(id => ({
                                    lichTrinhId: schedule.lichTrinhId,
                                    hocSinhId: id
                                }))
                            });
                        }
                    }

                    createdSchedules.push(schedule);
                });
            } catch (err) {
                console.error(`Error creating schedule for ${dateStr}:`, err);
                // Chi tiết lỗi để debug
                errors.push(`Lỗi ngày ${dateStr}: ${err.message}`);
            }
        }

        if (createdSchedules.length === 0 && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể tạo lịch trình. Vui lòng kiểm tra lại dữ liệu.',
                errors
            });
        }

        res.status(201).json({
            success: true,
            message: `Đã phân công ${createdSchedules.length} lịch trình thành công`,
            data: createdSchedules,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Create schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi tạo lịch trình: ' + error.message
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
                ...(gioKhoiHanh && { gioKhoiHanh: parseTime(gioKhoiHanh) }),
                ...(gioKetThuc && { gioKetThuc: parseTime(gioKetThuc) }),
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
            const scheduleIdInt = parseInt(scheduleId);

            // Check current status to decide update strategy
            const currentSchedule = await prisma.lichtrinh.findUnique({
                where: { lichTrinhId: scheduleIdInt },
                select: { trangThai: true }
            });

            if (currentSchedule && (currentSchedule.trangThai === 'in_progress' || currentSchedule.trangThai === 'completed')) {
                // Smart update: only add/remove, preserve existing status
                const existingTrips = await prisma.studentTrip.findMany({
                    where: { lichTrinhId: scheduleIdInt },
                    select: { hocSinhId: true }
                });

                const existingIds = existingTrips.map(t => t.hocSinhId);
                const newIds = studentIds.map(id => parseInt(id));

                // To delete: present in existing but not in new
                const toDelete = existingIds.filter(id => !newIds.includes(id));

                // To add: present in new but not in existing
                const toAdd = newIds.filter(id => !existingIds.includes(id));

                if (toDelete.length > 0) {
                    await prisma.studentTrip.deleteMany({
                        where: {
                            lichTrinhId: scheduleIdInt,
                            hocSinhId: { in: toDelete }
                        }
                    });
                }

                if (toAdd.length > 0) {
                    await prisma.studentTrip.createMany({
                        data: toAdd.map(studentId => ({
                            lichTrinhId: scheduleIdInt,
                            hocSinhId: studentId,
                            trangThai: 'pending'
                        }))
                    });
                }
            } else {
                // Scheduled/Cancelled: Safe to reset
                await prisma.studentTrip.deleteMany({
                    where: { lichTrinhId: scheduleIdInt }
                });

                if (studentIds.length > 0) {
                    const studentTrips = studentIds.map(studentId => ({
                        lichTrinhId: scheduleIdInt,
                        hocSinhId: parseInt(studentId),
                        trangThai: 'pending'
                    }));

                    await prisma.studentTrip.createMany({
                        data: studentTrips
                    });
                }
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