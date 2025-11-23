// backend/controller/driverController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy tất cả tài xế
exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await prisma.taixe.findMany({
            include: {
                user: {
                    select: {
                        userCode: true,
                        hoTen: true,
                        soDienThoai: true,
                        email: true
                    }
                },
                lichtrinh: {
                    where: {
                        ngay: {
                            gte: new Date()
                        }
                    },
                    include: {
                        xebuyt: true,
                        tuyenduong: true
                    },
                    orderBy: {
                        ngay: 'asc'
                    },
                    take: 5
                }
            },
            orderBy: {
                hoTen: 'asc'
            }
        });

        res.json({
            success: true,
            data: drivers
        });
    } catch (error) {
        console.error('Get all drivers error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tài xế',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Lấy tài xế theo ID
exports.getDriverById = async (req, res) => {
    try {
        const { id } = req.params;

        const driver = await prisma.taixe.findUnique({
            where: {
                taiXeId: parseInt(id)
            },
            include: {
                user: {
                    select: {
                        userCode: true,
                        hoTen: true,
                        soDienThoai: true,
                        email: true
                    }
                },
                lichtrinh: {
                    include: {
                        xebuyt: true,
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
                        }
                    },
                    orderBy: {
                        ngay: 'desc'
                    }
                }
            }
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài xế'
            });
        }

        res.json({
            success: true,
            data: driver
        });
    } catch (error) {
        console.error('Get driver by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin tài xế'
        });
    }
};

// Thêm tài xế mới
exports.createDriver = async (req, res) => {
    try {
        const { hoTen, userId, trangThai } = req.body;

        // Validate
        if (!hoTen) {
            return res.status(400).json({
                success: false,
                message: 'Họ tên là bắt buộc'
            });
        }

        // Nếu có userId, kiểm tra user có tồn tại không
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { userId: parseInt(userId) }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy user'
                });
            }

            // Kiểm tra user đã là tài xế chưa
            const existingDriver = await prisma.taixe.findUnique({
                where: { userId: parseInt(userId) }
            });

            if (existingDriver) {
                return res.status(400).json({
                    success: false,
                    message: 'User này đã là tài xế'
                });
            }
        }

        const driver = await prisma.taixe.create({
            data: {
                hoTen,
                userId: userId ? parseInt(userId) : null,
                trangThai: trangThai || 'Sẵn sàng'
            },
            include: {
                user: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Thêm tài xế thành công',
            data: driver
        });
    } catch (error) {
        console.error('Create driver error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm tài xế'
        });
    }
};

// Cập nhật tài xế
exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { hoTen, trangThai } = req.body;

        const driver = await prisma.taixe.update({
            where: {
                taiXeId: parseInt(id)
            },
            data: {
                hoTen,
                trangThai
            },
            include: {
                user: true
            }
        });

        res.json({
            success: true,
            message: 'Cập nhật tài xế thành công',
            data: driver
        });
    } catch (error) {
        console.error('Update driver error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật tài xế'
        });
    }
};

// Xóa tài xế
exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra tài xế có lịch trình không
        const driverWithSchedules = await prisma.taixe.findUnique({
            where: { taiXeId: parseInt(id) },
            include: {
                lichtrinh: true
            }
        });

        if (!driverWithSchedules) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài xế'
            });
        }

        if (driverWithSchedules.lichtrinh.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa tài xế đang có lịch trình'
            });
        }

        await prisma.taixe.delete({
            where: { taiXeId: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Xóa tài xế thành công'
        });
    } catch (error) {
        console.error('Delete driver error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa tài xế'
        });
    }
};

// Lấy lịch trình của tài xế
exports.getDriverSchedules = async (req, res) => {
    try {
        const { id } = req.params;

        const schedules = await prisma.lichtrinh.findMany({
            where: {
                taiXeId: parseInt(id)
            },
            include: {
                xebuyt: true,
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
                }
            },
            orderBy: {
                ngay: 'desc'
            }
        });

        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        console.error('Get driver schedules error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch trình tài xế'
        });
    }
};

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});