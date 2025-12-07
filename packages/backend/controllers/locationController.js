// ============================================
// backend/controller/locationController.js
// ============================================
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const socket = require('../socket'); // Import socket

// Lấy vị trí tất cả xe buýt
exports.getAllBusLocations = async (req, res) => {
    try {
        const buses = await prisma.xebuyt.findMany({
            where: {
                trangThai: 'Đang hoạt động'
            },
            include: {
                vitri: {
                    orderBy: {
                        thoiGian: 'desc'
                    },
                    take: 1
                },
                lichtrinh: {
                    where: {
                        ngay: new Date()
                    },
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
                        }
                    }
                }
            }
        });

        res.json({
            success: true,
            data: buses
        });
    } catch (error) {
        console.error('Get all bus locations error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy vị trí xe'
        });
    }
};

// Lấy vị trí xe theo ID
exports.getBusLocationById = async (req, res) => {
    try {
        const { busId } = req.params;

        const location = await prisma.vitri.findFirst({
            where: {
                xeBuytId: parseInt(busId)
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
        console.error('Get bus location by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy vị trí xe'
        });
    }
};

// Cập nhật vị trí xe (cho tài xế)
exports.updateBusLocation = async (req, res) => {
    try {
        const { busId } = req.params;
        const { vido, kinhdo } = req.body;

        if (!vido || !kinhdo) {
            return res.status(400).json({
                success: false,
                message: 'Vĩ độ và kinh độ là bắt buộc'
            });
        }

        const location = await prisma.vitri.create({
            data: {
                xeBuytId: parseInt(busId),
                vido: parseFloat(vido),
                kinhdo: parseFloat(kinhdo),
                thoiGian: new Date()
            },
            include: {
                xebuyt: true
            }
        });

        // --- EMIT SOCKET EVENT ---
        try {
            const io = socket.getIO();

            // 1. Find active schedule for this bus to emit to trip room
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const activeSchedule = await prisma.lichtrinh.findFirst({
                where: {
                    xeBuytId: parseInt(busId),
                    ngay: {
                        gte: today,
                        lt: tomorrow
                    }
                    // You might want to check time range too, but for now this is enough
                }
            });

            const updateData = {
                lat: parseFloat(vido),
                lng: parseFloat(kinhdo),
                busId: parseInt(busId),
                timestamp: new Date()
            };

            // Emit to specific trip room if found
            if (activeSchedule) {
                io.to(`trip_${activeSchedule.lichTrinhId}`).emit('BUS_LOCATION_UPDATE', updateData);
                console.log(`📍 Emitted location to trip_${activeSchedule.lichTrinhId}`);
            }

            // Also emit to a generic bus room (optional, but good for fallback)
            io.emit('BUS_LOCATION_UPDATE', updateData); // Broadcast to all for now (simplest for debugging)

        } catch (err) {
            console.error("Socket emit error:", err);
        }
        // -------------------------

        res.json({
            success: true,
            message: 'Cập nhật vị trí thành công',
            data: location
        });
    } catch (error) {
        console.error('Update bus location error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật vị trí'
        });
    }
};

// Lấy lịch sử vị trí
exports.getBusLocationHistory = async (req, res) => {
    try {
        const { busId } = req.params;
        const { startDate, endDate } = req.query;

        const where = {
            xeBuytId: parseInt(busId)
        };

        if (startDate || endDate) {
            where.thoiGian = {};
            if (startDate) where.thoiGian.gte = new Date(startDate);
            if (endDate) where.thoiGian.lte = new Date(endDate);
        }

        const locations = await prisma.vitri.findMany({
            where,
            orderBy: {
                thoiGian: 'desc'
            },
            take: 100
        });

        res.json({
            success: true,
            data: locations
        });
    } catch (error) {
        console.error('Get location history error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử vị trí'
        });
    }
};