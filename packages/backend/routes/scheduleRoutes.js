// ============================================
// backend/routes/scheduleRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', scheduleController.getAllSchedules);
router.get('/date', scheduleController.getSchedulesByDate);

// Chỉ school mới được tạo lịch trình
router.post('/', checkRole('school'), scheduleController.createSchedule);

module.exports = router;