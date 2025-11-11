// ============================================
// backend/routes/locationRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const locationController = require('../controller/locationController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/buses', locationController.getAllBusLocations);
router.get('/buses/:busId', locationController.getBusLocationById);
router.get('/buses/:busId/history', locationController.getBusLocationHistory);

// Chỉ driver mới được cập nhật vị trí
router.post('/buses/:busId', checkRole('driver'), locationController.updateBusLocation);

module.exports = router;