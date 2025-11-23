const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', notificationController.getAllNotifications);

// Chỉ school mới được gửi thông báo
router.post('/', authorize('school'), notificationController.sendNotification);

module.exports = router;
