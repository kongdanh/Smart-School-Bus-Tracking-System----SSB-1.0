const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.get('/parent/:parentId', studentController.getStudentsByParent);

// Chỉ school mới được thêm/sửa/xóa
router.post('/', authorize('school'), studentController.createStudent);
router.put('/:id', authorize('school'), studentController.updateStudent);
router.delete('/:id', authorize('school'), studentController.deleteStudent);

module.exports = router;
