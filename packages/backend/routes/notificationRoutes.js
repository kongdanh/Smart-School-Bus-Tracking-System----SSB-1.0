// backend/routes/NotificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // Yêu cầu đăng nhập cho tất cả route

// 1. Lấy thông báo của user đang đăng nhập (Phụ huynh)
// Frontend gọi: axiosInstance.get("/")
router.get('/', notificationController.getMyNotifications);

// 2. Lấy số lượng chưa đọc
// Frontend gọi: axiosInstance.get("/unread/count")
router.get('/unread/count', notificationController.getUnreadCount);

// 3. Đánh dấu 1 tin đã đọc
// Frontend gọi: axiosInstance.put(`/${id}/read`)
router.put('/:id/read', notificationController.markAsRead);

// 4. Đánh dấu tất cả đã đọc
// Frontend gọi: axiosInstance.put("/read-all")
router.put('/read-all', notificationController.markAllAsRead);

// 5. Gửi thông báo (Chỉ school/admin mới được gửi thủ công)
router.post('/', authorize('school', 'admin'), notificationController.sendNotification);

module.exports = router;