// backend/middleware/validateMiddleware.js
const { body, validationResult } = require('express-validator');

// Middleware kiểm tra kết quả validation
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array()
        });
    }
    next();
};

// Validation rules cho attendance
const validateAttendance = [
    body('lichTrinhId').isInt().withMessage('ID lịch trình không hợp lệ'),
    body('hocSinhId').isInt().withMessage('ID học sinh không hợp lệ'),
    validate
];

// Validation rules cho trip
const validateStartTrip = [
    body('lichTrinhId').isInt().withMessage('ID lịch trình không hợp lệ'),
    validate
];

const validateEndTrip = [
    body('tripRecordId').isInt().withMessage('ID chuyến xe không hợp lệ'),
    body('soKmDiDuoc').optional().isFloat({ min: 0 }).withMessage('Số km phải là số dương'),
    validate
];

const validateIncident = [
    body('tripRecordId').isInt().withMessage('ID chuyến xe không hợp lệ'),
    body('moTaSuCo').notEmpty().withMessage('Mô tả sự cố không được để trống'),
    validate
];

// Validation rules cho bus
const validateCreateBus = [
    body('maXe').notEmpty().withMessage('Mã xe không được để trống'),
    body('bienSo').notEmpty().withMessage('Biển số không được để trống'),
    body('sucChua').isInt({ min: 1 }).withMessage('Sức chứa phải là số nguyên dương'),
    body('namSanXuat').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Năm sản xuất không hợp lệ'),
    validate
];

const validateUpdateBus = [
    body('bienSo').optional().notEmpty().withMessage('Biển số không được để trống'),
    body('sucChua').optional().isInt({ min: 1 }).withMessage('Sức chứa phải là số nguyên dương'),
    body('trangThai').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Trạng thái không hợp lệ'),
    body('namSanXuat').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Năm sản xuất không hợp lệ'),
    validate
];

const validateBusLocation = [
    body('xeBuytId').isInt().withMessage('ID xe không hợp lệ'),
    body('vido').isFloat({ min: -90, max: 90 }).withMessage('Vĩ độ không hợp lệ'),
    body('kinhdo').isFloat({ min: -180, max: 180 }).withMessage('Kinh độ không hợp lệ'),
    validate
];

// Validation rules cho student
const validateCreateStudent = [
    body('maHS').notEmpty().withMessage('Mã học sinh không được để trống'),
    body('hoTen').notEmpty().withMessage('Họ tên không được để trống'),
    body('lop').optional().notEmpty().withMessage('Lớp không được để trống'),
    body('phuHuynhId').optional().isInt().withMessage('ID phụ huynh không hợp lệ'),
    validate
];

// Validation rules cho schedule
const validateCreateSchedule = [
    body('maLich').notEmpty().withMessage('Mã lịch không được để trống'),
    body('ngay').isDate().withMessage('Ngày không hợp lệ'),
    body('gioKhoiHanh').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Giờ khởi hành không hợp lệ'),
    body('gioKetThuc').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Giờ kết thúc không hợp lệ'),
    body('tuyenDuongId').isInt().withMessage('ID tuyến đường không hợp lệ'),
    body('taiXeId').isInt().withMessage('ID tài xế không hợp lệ'),
    body('xeBuytId').isInt().withMessage('ID xe buýt không hợp lệ'),
    validate
];

// Validation rules cho driver
const validateCreateDriver = [
    body('hoTen').notEmpty().withMessage('Họ tên không được để trống'),
    body('soDienThoai').optional().matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
    body('bienSoCapphep').optional().notEmpty().withMessage('Biển số cấp phép không được để trống'),
    validate
];

// Validation rules cho note
const validateNote = [
    body('lichTrinhId').isInt().withMessage('ID lịch trình không hợp lệ'),
    body('hocSinhId').isInt().withMessage('ID học sinh không hợp lệ'),
    body('ghiChu').notEmpty().withMessage('Ghi chú không được để trống'),
    validate
];

module.exports = {
    validate,
    validateAttendance,
    validateStartTrip,
    validateEndTrip,
    validateIncident,
    validateCreateBus,
    validateUpdateBus,
    validateBusLocation,
    validateCreateStudent,
    validateCreateSchedule,
    validateCreateDriver,
    validateNote
};