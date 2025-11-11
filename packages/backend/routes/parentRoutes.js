// ============================================
// backend/routes/parentRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const parentController = require('../controller/parentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(checkRole('parent')); // Chỉ parent mới truy cập

router.get('/me', parentController.getCurrentParent);
router.get('/children', parentController.getMyChildren);
router.get('/children/:studentId/bus-location', parentController.getChildBusLocation);
router.get('/children/:studentId/schedule', parentController.getChildSchedule);
router.get('/notifications', parentController.getNotifications);
router.put('/notifications/:notificationId/read', parentController.markNotificationAsRead);

module.exports = router;