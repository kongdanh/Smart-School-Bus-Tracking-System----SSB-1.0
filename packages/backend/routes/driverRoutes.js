const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Áp dụng middleware xác thực cho tất cả các route
router.use(protect);

// ==============================================================================
// 1. CÁC ROUTE TĨNH (STATIC ROUTES) - PHẢI ĐẶT TRƯỚC CÁC ROUTE CÓ :id
// ==============================================================================

// Lấy hồ sơ cá nhân (Dựa trên Token, phục vụ trang Settings)
router.get('/profile', driverController.getDriverProfile);

// Lấy danh sách tất cả (Dành cho Admin/Manager)
// Bạn có thể thêm authorize('school', 'admin') vào đây nếu cần bảo mật hơn
router.get('/', driverController.getAllDrivers);


// ==============================================================================
// 2. CÁC ROUTE ĐỘNG (DYNAMIC ROUTES) - CÓ THAM SỐ :id
// ==============================================================================

// Lấy lịch trình theo ID (Sửa lại thành 'schedule' cho khớp với Frontend)
router.get('/:id/schedule', driverController.getDriverSchedules);

// Lấy chi tiết tài xế theo ID (Route này dễ "ăn nhầm" các từ khóa khác nên để cuối cùng của nhóm GET)
router.get('/:id', driverController.getDriverById);


// ==============================================================================
// 3. CÁC ROUTE THÊM / SỬA / XÓA (Admin/School)
// ==============================================================================
router.post('/', authorize('school', 'admin'), driverController.createDriver);
router.put('/:id', authorize('school', 'admin'), driverController.updateDriver);
router.delete('/:id', authorize('school', 'admin'), driverController.deleteDriver);

module.exports = router;