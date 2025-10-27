// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route đăng nhập (public)
router.post('/login', authController.login);

// Route kiểm tra user hiện tại (protected)
router.get('/me', verifyToken, authController.getCurrentUser);

// Route đăng xuất (optional - chỉ cần clear token ở frontend)
router.post('/logout', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
});

module.exports = router;    