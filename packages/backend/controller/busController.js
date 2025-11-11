// backend/controller/busController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy tất cả xe buýt
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await prisma.xebuyt.findMany({
            include: {
                vitri: {
                    orderBy: {
                        thoiGian: 'desc'
                    },
                    take: 1
                },
                lichtrinh: {
                    where: {
                        ngay: {
                            gte: new Date()
                        }
                    },
                    include: {
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
                        tuyenduong: true
                    },
                    orderBy: {
                        ngay: 'asc'
                    },
                    take: 5
                }
            },
            orderBy: {
                maXe: 'asc'
            }
        });

        res.json({
            success: true,
            data: buses
        });
    } catch (error) {
        console.error('Get all buses error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách xe buýt',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Lấy xe buýt theo ID
exports.getBusById = async (req, res) => {
    try {
        const { id } = req.params;

        const bus = await prisma.xebuyt.findUnique({
            where: {
                xeBuytId: parseInt(id)
            },
            include: {
                vitri: {
                    orderBy: {
                        thoiGian: 'desc'
                    },
                    take: 50 // 50 vị trí gần nhất
                },
                lichtrinh: {
                    include: {
                        taixe: {
                            include: {
                                user: true
                            }
                        },
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
                    },
                    take: 20
                }
            }
        });

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy xe buýt'
            });
        }

        res.json({
            success: true,
            data: bus
        });
    } catch (error) {
        console.error('Get bus by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin xe buýt'
        });
    }
};

// Thêm xe buýt mới
exports.createBus = async (req, res) => {
    try {
        const { maXe, bienSo, sucChua, trangThai } = req.body;

        // Validate
        if (!maXe || !bienSo) {
            return res.status(400).json({
                success: false,
                message: 'Mã xe và biển số là bắt buộc'
            });
        }

        // Kiểm tra trùng mã xe
        const existingBus = await prisma.xebuyt.findUnique({
            where: { maXe }
        });

        if (existingBus) {
            return res.status(400).json({
                success: false,
                message: 'Mã xe đã tồn tại'
            });
        }

        const bus = await prisma.xebuyt.create({
            data: {
                maXe,
                bienSo,
                sucChua: sucChua ? parseInt(sucChua) : null,
                trangThai: trangThai || 'Đang hoạt động'
            }
        });

        res.status(201).json({
            success: true,
            message: 'Thêm xe buýt thành công',
            data: bus
        });
    } catch (error) {
        console.error('Create bus error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm xe buýt'
        });
    }
};

// Cập nhật xe buýt
exports.updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const { maXe, bienSo, sucChua, trangThai } = req.body;

        // Kiểm tra xe có tồn tại không
        const existingBus = await prisma.xebuyt.findUnique({
            where: { xeBuytId: parseInt(id) }
        });

        if (!existingBus) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy xe buýt'
            });
        }

        // Kiểm tra trùng mã xe (nếu đổi mã)
        if (maXe && maXe !== existingBus.maXe) {
            const duplicateBus = await prisma.xebuyt.findUnique({
                where: { maXe }
            });

            if (duplicateBus) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã xe đã tồn tại'
                });
            }
        }

        const bus = await prisma.xebuyt.update({
            where: { xeBuytId: parseInt(id) },
            data: {
                maXe,
                bienSo,
                sucChua: sucChua ? parseInt(sucChua) : undefined,
                trangThai
            }
        });

        res.json({
            success: true,
            message: 'Cập nhật xe buýt thành công',
            data: bus
        });
    } catch (error) {
        console.error('Update bus error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật xe buýt'
        });
    }
};

// Xóa xe buýt
exports.deleteBus = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xe có lịch trình không
        const busWithSchedules = await prisma.xebuyt.findUnique({
            where: { xeBuytId: parseInt(id) },
            include: {
                lichtrinh: true
            }
        });

        if (!busWithSchedules) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy xe buýt'
            });
        }

        if (busWithSchedules.lichtrinh.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa xe đang có lịch trình'
            });
        }

        await prisma.xebuyt.delete({
            where: { xeBuytId: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Xóa xe buýt thành công'
        });
    } catch (error) {
        console.error('Delete bus error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa xe buýt'
        });
    }
};

// Lấy vị trí hiện tại của xe
exports.getBusLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const location = await prisma.vitri.findFirst({
            where: {
                xeBuytId: parseInt(id)
            },
            orderBy: {
                thoiGian: 'desc'
            },
            include: {
                xebuyt: true
            }
        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy vị trí xe'
            });
        }

        res.json({
            success: true,
            data: location
        });
    } catch (error) {
        console.error('Get bus location error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy vị trí xe'
        });
    }
};

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});