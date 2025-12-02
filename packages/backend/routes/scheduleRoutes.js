const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', scheduleController.getAllSchedules);
router.get('/date', scheduleController.getSchedulesByDate);

// Chỉ school mới được tạo lịch trình
router.post('/', authorize('school'), scheduleController.createSchedule);

// Thêm học sinh vào lịch trình
router.post('/:scheduleId/students/:studentId', authorize('school'), scheduleController.assignStudentToSchedule);

module.exports = router;
