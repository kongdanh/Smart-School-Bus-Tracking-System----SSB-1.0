// backend/routes/parentRoutes.js
const express = require('express');
const router = express.Router();
const parentController = require('../controller/parentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Áp dụng middleware cho tất cả routes
router.use(verifyToken);
router.use(checkRole('parent'));

// Routes cho phụ huynh
router.get('/children', parentController.getChildren);
router.get('/children/:id', parentController.getChildById);
router.get('/schedule', parentController.getSchedule);
router.get('/bus-location', parentController.getBusLocation);
router.get('/notifications', parentController.getNotifications);

module.exports = router;