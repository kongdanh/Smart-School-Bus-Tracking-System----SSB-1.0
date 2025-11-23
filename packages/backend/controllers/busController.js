// backend/controllers/busController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy danh sách xe buýt (School Admin)
exports.getAllBuses = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = search ? {
            OR: [
                { maXe: { contains: search } },
                { bienSo: { contains: search } }
            ]
        } : {};

        const [buses, total] = await Promise.all([
            prisma.xebuyt.findMany({
                where,
                include: {
                    lichtrinh: {
                        where: {
                            ngay: new Date(new Date().setHours(0, 0, 0, 0))
                        },
                        include: {
                            taixe: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    },
                    vitri: {
                        orderBy: {
                            thoiGian: 'desc'
                        },
                        take: 1
                    }
                },
                skip,
                take: parseInt(limit),
                orderBy: {
                    maXe: 'asc'
                }
            }),
            prisma.xebuyt.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                buses,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Error getting all buses:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Lấy thông tin xe của tài xế hiện tại
exports.getDriverBus = async (req, res) => {
    try {
        const taiXeId = req.user.taixe?.taiXeId;

        if (!taiXeId) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
        }

        // Tìm lịch trình hôm nay của tài xế
        const todaySchedule = await prisma.lichtrinh.findFirst({
            where: {
                taiXeId: taiXeId,
                ngay: new Date(new Date().setHours(0, 0, 0, 0))
            },
            include: {
                xebuyt: {
                    include: {
                        vitri: {
                            orderBy: {
                                thoiGian: 'desc'
                            },
                            take: 1
                        },
                        maintenance: {
                            where: {
                                trangThai: 'pending'
                            },
                            orderBy: {
                                thoiGianBD: 'desc'
                            }
                        }
                    }
                }
            }
        });

        if (!todaySchedule || !todaySchedule.xebuyt) {
            return res.json({ success: true, data: null });
        }

        res.json({ success: true, data: todaySchedule.xebuyt });

    } catch (error) {
        console.error('Error getting driver bus:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Lấy chi tiết xe buýt
exports.getBusDetail = async (req, res) => {
    try {
        const { xeBuytId } = req.params;

        const bus = await prisma.xebuyt.findUnique({
            where: { xeBuytId: parseInt(xeBuytId) },
            include: {
                lichtrinh: {
                    where: {
                        ngay: {
                            gte: new Date(new Date().setDate(new Date().getDate() - 7))
                        }
                    },
                    include: {
                        taixe: {
                            include: {
                                user: true
                            }
                        },
                        tuyenduong: true
                    },
                    orderBy: {
                        ngay: 'desc'
                    }
                },
                maintenance: {
                    orderBy: {
                        thoiGianBD: 'desc'
                    },
                    take: 10
                },
                vitri: {
                    orderBy: {
                        thoiGian: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!bus) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
        }

        res.json({ success: true, data: bus });

    } catch (error) {
        console.error('Error getting bus detail:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Tạo xe buýt mới (School Admin)
exports.createBus = async (req, res) => {
    try {
        const { maXe, bienSo, sucChua, namSanXuat, ngayKiemDinh } = req.body;

        // Kiểm tra xe đã tồn tại
        const existingBus = await prisma.xebuyt.findFirst({
            where: {
                OR: [
                    { maXe: maXe },
                    { bienSo: bienSo }
                ]
            }
        });

        if (existingBus) {
            return res.status(400).json({ success: false, message: 'Xe đã tồn tại' });
        }

        const bus = await prisma.xebuyt.create({
            data: {
                maXe,
                bienSo,
                sucChua: parseInt(sucChua),
                namSanXuat: namSanXuat ? parseInt(namSanXuat) : null,
                ngayKiemDinh: ngayKiemDinh ? new Date(ngayKiemDinh) : null,
                trangThai: 'active'
            }
        });

        res.json({ success: true, data: bus });

    } catch (error) {
        console.error('Error creating bus:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật thông tin xe (School Admin)
exports.updateBus = async (req, res) => {
    try {
        const { xeBuytId } = req.params;
        const { bienSo, sucChua, trangThai, namSanXuat, ngayKiemDinh } = req.body;

        const updateData = {};
        if (bienSo !== undefined) updateData.bienSo = bienSo;
        if (sucChua !== undefined) updateData.sucChua = parseInt(sucChua);
        if (trangThai !== undefined) updateData.trangThai = trangThai;
        if (namSanXuat !== undefined) updateData.namSanXuat = parseInt(namSanXuat);
        if (ngayKiemDinh !== undefined) updateData.ngayKiemDinh = new Date(ngayKiemDinh);

        const bus = await prisma.xebuyt.update({
            where: { xeBuytId: parseInt(xeBuytId) },
            data: updateData
        });

        res.json({ success: true, data: bus });

    } catch (error) {
        console.error('Error updating bus:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Xóa xe (School Admin)
exports.deleteBus = async (req, res) => {
    try {
        const { xeBuytId } = req.params;

        // Kiểm tra xe có lịch trình không
        const scheduleCount = await prisma.lichtrinh.count({
            where: {
                xeBuytId: parseInt(xeBuytId),
                trangThai: {
                    in: ['scheduled', 'in_progress']
                }
            }
        });

        if (scheduleCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa xe đang có lịch trình'
            });
        }

        await prisma.xebuyt.delete({
            where: { xeBuytId: parseInt(xeBuytId) }
        });

        res.json({ success: true, message: 'Xóa xe thành công' });

    } catch (error) {
        console.error('Error deleting bus:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật vị trí xe (Driver hoặc GPS device)
exports.updateBusLocation = async (req, res) => {
    try {
        const { xeBuytId, vido, kinhdo } = req.body;

        const location = await prisma.vitri.create({
            data: {
                xeBuytId: parseInt(xeBuytId),
                vido: parseFloat(vido),
                kinhdo: parseFloat(kinhdo),
                thoiGian: new Date()
            }
        });

        res.json({ success: true, data: location });

    } catch (error) {
        console.error('Error updating bus location:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Lấy vị trí hiện tại của xe
exports.getBusLocation = async (req, res) => {
    try {
        const { xeBuytId } = req.params;

        const location = await prisma.vitri.findFirst({
            where: { xeBuytId: parseInt(xeBuytId) },
            orderBy: {
                thoiGian: 'desc'
            }
        });

        res.json({ success: true, data: location });

    } catch (error) {
        console.error('Error getting bus location:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// Thống kê xe buýt (School Admin)
exports.getBusStats = async (req, res) => {
    try {
        const [total, active, maintenance, inactive] = await Promise.all([
            prisma.xebuyt.count(),
            prisma.xebuyt.count({ where: { trangThai: 'active' } }),
            prisma.xebuyt.count({ where: { trangThai: 'maintenance' } }),
            prisma.xebuyt.count({ where: { trangThai: 'inactive' } })
        ]);

        res.json({
            success: true,
            data: {
                total,
                active,
                maintenance,
                inactive
            }
        });

    } catch (error) {
        console.error('Error getting bus stats:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};