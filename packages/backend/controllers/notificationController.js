// backend/controllers/notificationController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy tất cả thông báo (Dành cho Admin nếu cần)
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await prisma.thongbao.findMany({
            include: { phuhuynh: { include: { user: { select: { hoTen: true } } } } },
            orderBy: { thoiGianGui: 'desc' }
        });
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy thông báo' });
    }
};

// --- CÁC HÀM CHO PHỤ HUYNH ---

// 1. Lấy thông báo của User đang đăng nhập (Phụ huynh)
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy từ middleware protect

        // Tìm hồ sơ phụ huynh dựa trên userId
        const parent = await prisma.phuhuynh.findUnique({
            where: { userId: userId }
        });

        if (!parent) {
            // Nếu là tài xế hoặc admin login mà gọi hàm này thì trả về rỗng
            return res.json({ success: true, data: [] });
        }

        const notifications = await prisma.thongbao.findMany({
            where: { phuHuynhId: parent.phuHuynhId },
            orderBy: { thoiGianGui: 'desc' } // Mới nhất lên đầu
        });

        res.json({ success: true, data: notifications });
    } catch (error) {
        console.error('Get my notifications error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 2. Đánh dấu 1 thông báo đã đọc
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.thongbao.update({
            where: { thongBaoId: parseInt(id) },
            data: { daDoc: true }
        });
        res.json({ success: true, message: "Đã đánh dấu đã đọc" });
    } catch (error) {
        console.error("Mark read error:", error);
        res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
    }
};

// 3. Đánh dấu tất cả đã đọc
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const parent = await prisma.phuhuynh.findUnique({ where: { userId } });

        if (parent) {
            await prisma.thongbao.updateMany({
                where: { phuHuynhId: parent.phuHuynhId, daDoc: false },
                data: { daDoc: true }
            });
        }
        res.json({ success: true, message: "Đã đánh dấu tất cả là đã đọc" });
    } catch (error) {
        console.error("Mark all read error:", error);
        res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
    }
};

// 4. Lấy số lượng tin chưa đọc
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const parent = await prisma.phuhuynh.findUnique({ where: { userId } });

        if (!parent) return res.json({ count: 0 });

        const count = await prisma.thongbao.count({
            where: { phuHuynhId: parent.phuHuynhId, daDoc: false }
        });
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Gửi thông báo thủ công (Admin/School)
exports.sendNotification = async (req, res) => {
    try {
        const { phuHuynhId, noiDung, loai } = req.body;
        if (!noiDung) {
            return res.status(400).json({ success: false, message: 'Nội dung thông báo là bắt buộc' });
        }
        const notification = await prisma.thongbao.create({
            data: {
                phuHuynhId: phuHuynhId ? parseInt(phuHuynhId) : null,
                noiDung,
                loai,
                thoiGianGui: new Date()
            }
        });
        res.status(201).json({ success: true, message: 'Gửi thông báo thành công', data: notification });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi gửi thông báo' });
    }
};