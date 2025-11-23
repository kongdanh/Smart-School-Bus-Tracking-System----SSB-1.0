const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả routes yêu cầu authentication và role driver
router.use(protect);
router.use(authorize('driver'));

// Lấy danh sách học sinh theo lịch trình
router.get('/schedule/:lichTrinhId', attendanceController.getStudentsBySchedule);

// Điểm danh đón học sinh
router.post('/pickup', attendanceController.markPickup);

// Điểm danh trả học sinh
router.post('/dropoff', attendanceController.markDropoff);

// Hủy điểm danh đón
router.post('/unpickup', attendanceController.unmarkPickup);

// Hủy điểm danh trả
router.post('/undropoff', attendanceController.unmarkDropoff);

// Thêm ghi chú
router.post('/note', attendanceController.addNote);

// Điểm danh tất cả
router.post('/pickup-all', attendanceController.markAllPickup);

// Lấy báo cáo điểm danh (driver và school admin)
router.get('/report/:lichTrinhId', attendanceController.getAttendanceReport);

module.exports = router;