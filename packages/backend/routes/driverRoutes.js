const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriverById);
router.get('/:id/schedules', driverController.getDriverSchedules);

// Chỉ school mới được thêm/sửa/xóa
router.post('/', authorize('school'), driverController.createDriver);
router.put('/:id', authorize('school'), driverController.updateDriver);
router.delete('/:id', authorize('school'), driverController.deleteDriver);

module.exports = router;