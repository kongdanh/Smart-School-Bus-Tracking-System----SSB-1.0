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

// Tạo tuyến mới (kèm điểm dừng)
exports.createRoute = async (req, res) => {
    try {
        const { maTuyen, tenTuyen, stops } = req.body;

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

        // Sử dụng transaction để tạo tuyến và điểm dừng cùng lúc
        const route = await prisma.$transaction(async (tx) => {
            // 1. Tạo tuyến đường
            const newRoute = await tx.tuyenduong.create({
                data: {
                    maTuyen,
                    tenTuyen
                }
            });

            // 2. Tạo điểm dừng nếu có
            if (stops && Array.isArray(stops) && stops.length > 0) {
                for (let i = 0; i < stops.length; i++) {
                    const stop = stops[i];
                    let stopId = stop.diemDungId;

                    // Nếu chưa có ID, tạo điểm dừng mới
                    if (!stopId) {
                        const newStop = await tx.diemdung.create({
                            data: {
                                tenDiemDung: stop.tenDiemDung || `Điểm dừng ${i + 1}`,
                                diaChi: stop.diaChi || null,
                                vido: stop.vido ? parseFloat(stop.vido) : null,
                                kinhdo: stop.kinhdo ? parseFloat(stop.kinhdo) : null
                            }
                        });
                        stopId = newStop.diemDungId;
                    }

                    // Liên kết điểm dừng vào tuyến
                    await tx.tuyenduong_diemdung.create({
                        data: {
                            tuyenDuongId: newRoute.tuyenDuongId,
                            diemDungId: stopId,
                            thuTu: i + 1
                        }
                    });
                }
            }

            return newRoute;
        });

        // Fetch lại đầy đủ thông tin để trả về
        const fullRoute = await prisma.tuyenduong.findUnique({
            where: { tuyenDuongId: route.tuyenDuongId },
            include: {
                tuyenduong_diemdung: {
                    include: { diemdung: true },
                    orderBy: { thuTu: 'asc' }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Thêm tuyến thành công',
            data: fullRoute
        });
    } catch (error) {
        console.error('Create route error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm tuyến: ' + error.message
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
        const { diemDungId, tenDiemDung, diaChi, vido, kinhdo, thuTu } = req.body;

        let stopId = diemDungId;

        // Nếu không có diemDungId, tạo điểm dừng mới
        if (!diemDungId && tenDiemDung) {
            const newStop = await prisma.diemdung.create({
                data: {
                    tenDiemDung,
                    diaChi: diaChi || null,
                    vido: vido ? parseFloat(vido) : null,
                    kinhdo: kinhdo ? parseFloat(kinhdo) : null
                }
            });
            stopId = newStop.diemDungId;
        }

        if (!stopId) {
            return res.status(400).json({
                success: false,
                message: 'Cần cung cấp diemDungId hoặc thông tin điểm dừng mới'
            });
        }

        const routeStop = await prisma.tuyenduong_diemdung.create({
            data: {
                tuyenDuongId: parseInt(routeId),
                diemDungId: parseInt(stopId),
                thuTu: parseInt(thuTu) || 1
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

// Cập nhật tuyến đường
exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { maTuyen, tenTuyen, stops } = req.body;

        // Transaction để update tuyến và điểm dừng
        const updatedRoute = await prisma.$transaction(async (tx) => {
            // 1. Update thông tin cơ bản
            const route = await tx.tuyenduong.update({
                where: { tuyenDuongId: parseInt(id) },
                data: {
                    maTuyen,
                    tenTuyen
                }
            });

            // 2. Nếu có danh sách stops mới, cập nhật lại toàn bộ điểm dừng
            if (stops && Array.isArray(stops)) {
                // Xóa các liên kết cũ
                await tx.tuyenduong_diemdung.deleteMany({
                    where: { tuyenDuongId: parseInt(id) }
                });

                // Tạo lại liên kết mới
                for (let i = 0; i < stops.length; i++) {
                    const stop = stops[i];
                    let stopId = stop.diemDungId;

                    // Nếu là điểm dừng mới (chưa có ID hoặc ID tạm)
                    if (!stopId || stopId < 0) {
                        const newStop = await tx.diemdung.create({
                            data: {
                                tenDiemDung: stop.tenDiemDung || `Điểm dừng ${i + 1}`,
                                diaChi: stop.diaChi || null,
                                vido: stop.vido ? parseFloat(stop.vido) : null,
                                kinhdo: stop.kinhdo ? parseFloat(stop.kinhdo) : null
                            }
                        });
                        stopId = newStop.diemDungId;
                    } else {
                        // Nếu là điểm dừng cũ, có thể update thông tin nếu cần
                        // Ở đây ta giả sử chỉ update vị trí nếu có thay đổi
                        await tx.diemdung.update({
                            where: { diemDungId: parseInt(stopId) },
                            data: {
                                tenDiemDung: stop.tenDiemDung,
                                diaChi: stop.diaChi,
                                vido: stop.vido ? parseFloat(stop.vido) : null,
                                kinhdo: stop.kinhdo ? parseFloat(stop.kinhdo) : null
                            }
                        });
                    }

                    // Tạo liên kết
                    await tx.tuyenduong_diemdung.create({
                        data: {
                            tuyenDuongId: parseInt(id),
                            diemDungId: parseInt(stopId),
                            thuTu: i + 1
                        }
                    });
                }
            }

            return route;
        });

        res.json({
            success: true,
            message: 'Cập nhật tuyến đường thành công',
            data: updatedRoute
        });
    } catch (error) {
        console.error('Update route error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật tuyến đường'
        });
    }
};

// Xóa tuyến đường
exports.deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.tuyenduong.delete({
            where: { tuyenDuongId: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Xóa tuyến đường thành công'
        });
    } catch (error) {
        console.error('Delete route error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa tuyến đường'
        });
    }
};