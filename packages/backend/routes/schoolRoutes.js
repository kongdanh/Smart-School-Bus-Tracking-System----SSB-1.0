// backend/routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controller/schoolController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Áp dụng middleware cho tất cả routes
router.use(verifyToken);
router.use(checkRole('school'));

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

// ==================== LỊCH TRÌNH ====================
router.get('/schedules', schoolController.getAllSchedules);

// ==================== TRACKING ====================
router.get('/tracking', schoolController.getAllBusLocations);

module.exports = router;