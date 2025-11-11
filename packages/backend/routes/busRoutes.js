// ============================================
// backend/routes/busRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const busController = require('../controller/busController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', busController.getAllBuses);
router.get('/:id', busController.getBusById);
router.get('/:id/location', busController.getBusLocation);

// Chỉ school mới được thêm/sửa/xóa
router.post('/', checkRole('school'), busController.createBus);
router.put('/:id', checkRole('school'), busController.updateBus);
router.delete('/:id', checkRole('school'), busController.deleteBus);

module.exports = router;