// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = 'uploads';
const avatarDir = path.join(uploadDir, 'avatars');
const attendanceDir = path.join(uploadDir, 'attendance');

[uploadDir, avatarDir, attendanceDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = uploadDir;

        // Xác định thư mục dựa vào loại upload
        if (req.path.includes('avatar')) {
            uploadPath = avatarDir;
        } else if (req.path.includes('attendance')) {
            uploadPath = attendanceDir;
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Tạo tên file unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, filename);
    }
});

// File filter - chỉ chấp nhận ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)'), false);
    }
};

// Cấu hình limits
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
};

// Middleware upload avatar
const uploadAvatar = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
}).single('avatar');

// Middleware upload ảnh attendance
const uploadAttendancePhoto = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
}).single('photo');

// Middleware upload multiple photos (nếu cần)
const uploadMultiplePhotos = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10
    }
}).array('photos', 10);

// Middleware xử lý lỗi upload
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File quá lớn. Kích thước tối đa 5MB'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Quá nhiều file'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Lỗi upload: ' + err.message
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Hàm xóa file
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

// Hàm lấy URL của file
const getFileUrl = (req, filename, type = 'avatar') => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${type}/${filename}`;
};

module.exports = {
    uploadAvatar,
    uploadAttendancePhoto,
    uploadMultiplePhotos,
    handleUploadError,
    deleteFile,
    getFileUrl
};