const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);
router.get('/:routeId/stops', routeController.getRouteStops);

// Chỉ school mới được thêm/sửa/xóa
router.post('/', authorize('school'), routeController.createRoute);
router.post('/:routeId/stops', authorize('school'), routeController.addStopToRoute);

module.exports = router;
