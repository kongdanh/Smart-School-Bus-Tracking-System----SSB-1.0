const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const stopController = require('../controllers/stopController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Áp dụng middleware cho tất cả routes
router.use(protect);
router.use(authorize('school'));

// ==================== DASHBOARD ====================
router.get('/dashboard', schoolController.getDashboard);

// ==================== HỌC SINH ====================
router.get('/students', schoolController.getAllStudents);
router.get('/students/:id', schoolController.getStudentById);
router.post('/students', schoolController.createStudent);
router.put('/students/:id', schoolController.updateStudent);
router.delete('/students/:id', schoolController.deleteStudent);

// ==================== TÀI XẾ ====================
router.get('/drivers', schoolController.getAllDrivers);
router.get('/drivers/:id', schoolController.getDriverById);

// ==================== XE BUÝT ====================
router.get('/buses', schoolController.getAllBuses);
router.get('/buses/:id', schoolController.getBusById);
router.post('/buses', schoolController.createBus);
router.put('/buses/:id', schoolController.updateBus);
router.delete('/buses/:id', schoolController.deleteBus);

// ==================== TUYẾN ĐƯỜNG ====================
router.get('/routes', schoolController.getAllRoutes);
router.post('/routes', schoolController.createRoute);
router.get('/routes/:id', schoolController.getRouteById);
router.put('/routes/:id', schoolController.updateRoute);
router.delete('/routes/:id', schoolController.deleteRoute);
router.post('/routes/:routeId/stops', schoolController.addStopToRoute);
router.get('/routes/:routeId/stops', schoolController.getRouteStops);

// ==================== ĐIỂM DỪNG (STOPS) ====================
router.get('/stops', stopController.getAllStops);
router.post('/stops', stopController.createStop);
router.put('/stops/:id', stopController.updateStop);
router.delete('/stops/:id', stopController.deleteStop);

// ==================== LỊCH TRÌNH ====================
router.get('/schedules', schoolController.getAllSchedules);
router.post('/schedules', schoolController.createSchedule);
router.post('/schedules/:scheduleId/students/:studentId', schoolController.assignStudentToSchedule);

// ==================== TRACKING ====================
router.get('/tracking', schoolController.getAllBusLocations);

module.exports = router;