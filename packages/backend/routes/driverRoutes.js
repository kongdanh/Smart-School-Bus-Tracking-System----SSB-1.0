// ============================================
// backend/routes/driverRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const driverController = require('../controller/driverController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriverById);
router.get('/:id/schedules', driverController.getDriverSchedules);

// Chỉ school mới được thêm/sửa/xóa
router.post('/', checkRole('school'), driverController.createDriver);
router.put('/:id', checkRole('school'), driverController.updateDriver);
router.delete('/:id', checkRole('school'), driverController.deleteDriver);

module.exports = router;