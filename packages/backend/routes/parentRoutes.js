const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Bảo vệ routes, chỉ cho phép Parent
router.use(protect);
router.use(authorize('parent'));

// Lấy danh sách con
router.get('/children', parentController.getMyChildren);

// Lấy vị trí xe của con (Tracking)
router.get('/tracking/:hocSinhId', parentController.getChildBusLocation);

module.exports = router;