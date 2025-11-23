const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả routes yêu cầu authentication và role driver
router.use(protect);
router.use(authorize('driver'));

// Bắt đầu chuyến xe
router.post('/start', tripController.startTrip);

// Kết thúc chuyến xe
router.post('/end', tripController.endTrip);

// Báo cáo sự cố
router.post('/incident', tripController.reportIncident);

// Cập nhật số km
router.put('/distance', tripController.updateDistance);

// Lấy chuyến xe hiện tại
router.get('/current', tripController.getCurrentTrip);

// Lấy lịch sử chuyến xe
router.get('/history', tripController.getTripHistory);

// Lấy chi tiết chuyến xe
router.get('/:tripRecordId', tripController.getTripDetail);

module.exports = router;