// ============================================
// backend/routes/studentRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.get('/parent/:parentId', studentController.getStudentsByParent);

// Chỉ school mới được thêm/sửa/xóa
router.post('/', checkRole('school'), studentController.createStudent);
router.put('/:id', checkRole('school'), studentController.updateStudent);
router.delete('/:id', checkRole('school'), studentController.deleteStudent);

module.exports = router;