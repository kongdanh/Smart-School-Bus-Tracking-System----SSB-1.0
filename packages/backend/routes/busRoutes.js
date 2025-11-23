const express = require('express');
const router = express.Router();

// Controller
const busController = require('../controllers/busController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// ================================================================
// PUBLIC ROUTES (không cần đăng nhập)
// ================================================================

// GPS device hoặc app tài xế gửi vị trí xe (không cần token)
router.post('/location', busController.updateBusLocation);

// ================================================================
// PROTECTED ROUTES (yêu cầu đăng nhập - tất cả route bên dưới)
// ================================================================
router.use(protect); // ← Tất cả route từ đây trở xuống đều phải có token hợp lệ

// ================================================================
// ROLE-BASED ROUTES
// ================================================================

// Driver chỉ xem được xe của mình
router.get('/my-bus', authorize('driver'), busController.getDriverBus);

// School admin quản lý toàn bộ xe buýt
router
    .route('/')
    .get(authorize('school'), busController.getAllBuses)
    .post(authorize('school'), busController.createBus);

router.get('/stats', authorize('school'), busController.getBusStats);

router
    .route('/:xeBuytId')
    .put(authorize('school'), busController.updateBus)
    .delete(authorize('school'), busController.deleteBus)
    .get(authorize('driver', 'school', 'parent'), busController.getBusDetail);

// Lấy vị trí xe (driver, school admin, phụ huynh đều xem được)
router.get(
    '/:xeBuytId/location',
    authorize('driver', 'school', 'parent'),
    busController.getBusLocation
);

module.exports = router;