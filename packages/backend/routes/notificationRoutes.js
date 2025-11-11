// ============================================
// backend/routes/notificationRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', notificationController.getAllNotifications);

// Chỉ school mới được gửi thông báo
router.post('/', checkRole('school'), notificationController.sendNotification);

module.exports = router;