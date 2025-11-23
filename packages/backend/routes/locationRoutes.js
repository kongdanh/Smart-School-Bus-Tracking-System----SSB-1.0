const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/buses', locationController.getAllBusLocations);
router.get('/buses/:busId', locationController.getBusLocationById);
router.get('/buses/:busId/history', locationController.getBusLocationHistory);

// Chỉ driver mới được cập nhật vị trí
router.post('/buses/:busId', authorize('driver'), locationController.updateBusLocation);

module.exports = router;