// ============================================
// backend/controller/notificationController.js
// ============================================
const { PrismaClient } = require('@prisma/client'); // <-- BỔ SUNG DÒNG NÀY
const prisma = new PrismaClient();                  // <-- BỔ SUNG DÒNG NÀY

// Lấy tất cả thông báo
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await prisma.thongbao.findMany({
            include: {
                phuhuynh: {
                    include: {
                        user: {
                            select: {
                                hoTen: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                thoiGianGui: 'desc'
            }
        });

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Get all notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông báo'
        });
    }
};

// Gửi thông báo
exports.sendNotification = async (req, res) => {
    try {
        const { phuHuynhId, noiDung, loai } = req.body;

        if (!noiDung) {
            return res.status(400).json({
                success: false,
                message: 'Nội dung thông báo là bắt buộc'
            });
        }

        const notification = await prisma.thongbao.create({
            data: {
                phuHuynhId: phuHuynhId ? parseInt(phuHuynhId) : null,
                noiDung,
                loai,
                thoiGianGui: new Date()
            }
        });

        res.status(201).json({
            success: true,
            message: 'Gửi thông báo thành công',
            data: notification
        });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi thông báo'
        });
    }
};