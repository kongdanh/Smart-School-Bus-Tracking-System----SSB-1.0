// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// DEBUG authController
console.log('authController:', authController);
console.log('authController.login:', authController.login);
console.log('authController.getCurrentUser:', authController.getCurrentUser);

const { protect } = require('../middleware/authMiddleware');

// DEBUG protect
console.log('protect middleware:', protect);

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect, authController.getCurrentUser);

router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Đăng xuất thành công (xóa token ở client)' });
});

module.exports = router;