const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', stopController.getAllStops);
router.post('/', authorize('school'), stopController.createStop);
router.put('/:id', authorize('school'), stopController.updateStop);
router.delete('/:id', authorize('school'), stopController.deleteStop);

module.exports = router;
