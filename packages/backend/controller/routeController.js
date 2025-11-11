// ============================================
// backend/controller/routeController.js
// ============================================

// Lấy tất cả tuyến đường
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await prisma.tuyenduong.findMany({
            include: {
                tuyenduong_diemdung: {
                    include: {
                        diemdung: true
                    },
                    orderBy: {
                        thuTu: 'asc'
                    }
                },
                lichtrinh: {
                    take: 5,
                    orderBy: {
                        ngay: 'desc'
                    },
                    include: {
                        xebuyt: true,
                        taixe: {
                            include: {
                                user: {
                                    select: {
                                        hoTen: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                maTuyen: 'asc'
            }
        });

        res.json({
            success: true,
            data: routes
        });
    } catch (error) {
        console.error('Get all routes error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tuyến'
        });
    }
};

// Lấy tuyến đường theo ID
exports.getRouteById = async (req, res) => {
    try {
        const { id } = req.params;

        const route = await prisma.tuyenduong.findUnique({
            where: {
                tuyenDuongId: parseInt(id)
            },
            include: {
                tuyenduong_diemdung: {
                    include: {
                        diemdung: true
                    },
                    orderBy: {
                        thuTu: 'asc'
                    }
                },
                lichtrinh: {
                    include: {
                        xebuyt: true,
                        taixe: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        ngay: 'desc'
                    }
                }
            }
        });

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tuyến đường'
            });
        }

        res.json({
            success: true,
            data: route
        });
    } catch (error) {
        console.error('Get route by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin tuyến'
        });
    }
};

// Tạo tuyến mới
exports.createRoute = async (req, res) => {
    try {
        const { maTuyen, tenTuyen } = req.body;

        if (!maTuyen) {
            return res.status(400).json({
                success: false,
                message: 'Mã tuyến là bắt buộc'
            });
        }

        const existingRoute = await prisma.tuyenduong.findUnique({
            where: { maTuyen }
        });

        if (existingRoute) {
            return res.status(400).json({
                success: false,
                message: 'Mã tuyến đã tồn tại'
            });
        }

        const route = await prisma.tuyenduong.create({
            data: {
                maTuyen,
                tenTuyen
            }
        });

        res.status(201).json({
            success: true,
            message: 'Thêm tuyến thành công',
            data: route
        });
    } catch (error) {
        console.error('Create route error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm tuyến'
        });
    }
};

// Lấy điểm dừng của tuyến
exports.getRouteStops = async (req, res) => {
    try {
        const { routeId } = req.params;

        const stops = await prisma.tuyenduong_diemdung.findMany({
            where: {
                tuyenDuongId: parseInt(routeId)
            },
            include: {
                diemdung: true
            },
            orderBy: {
                thuTu: 'asc'
            }
        });

        res.json({
            success: true,
            data: stops
        });
    } catch (error) {
        console.error('Get route stops error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy điểm dừng'
        });
    }
};

// Thêm điểm dừng vào tuyến
exports.addStopToRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        const { diemDungId, thuTu } = req.body;

        const routeStop = await prisma.tuyenduong_diemdung.create({
            data: {
                tuyenDuongId: parseInt(routeId),
                diemDungId: parseInt(diemDungId),
                thuTu: parseInt(thuTu)
            },
            include: {
                diemdung: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Thêm điểm dừng thành công',
            data: routeStop
        });
    } catch (error) {
        console.error('Add stop to route error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm điểm dừng'
        });
    }
};