// ============================================
// backend/routes/routeRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const routeController = require('../controller/routeController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);
router.get('/:routeId/stops', routeController.getRouteStops);

// Chỉ school mới được thêm/sửa/xóa
router.post('/', checkRole('school'), routeController.createRoute);
router.post('/:routeId/stops', checkRole('school'), routeController.addStopToRoute);

module.exports = router;