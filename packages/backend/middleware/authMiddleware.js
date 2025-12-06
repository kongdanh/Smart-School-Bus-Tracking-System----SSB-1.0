const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Khởi tạo Prisma Client để truy vấn DB

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Lấy token từ header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token, vui lòng đăng nhập'
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. TRUY VẤN DATABASE ĐỂ LẤY THÔNG TIN ĐẦY ĐỦ (Quan trọng!)
    // Chúng ta dùng userId từ token để tìm user trong DB
    // Và dùng 'include' để lấy luôn thông tin bảng taixe, quanly, phuhuynh
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId }, // Đảm bảo payload token bạn lưu là 'userId'
      include: {
        taixe: true,        // Lấy thông tin tài xế (để có taiXeId)
        quanlyxebuyt: true, // Lấy thông tin quản lý
        phuhuynh: true      // Lấy thông tin phụ huynh
      }
    });

    // Nếu không tìm thấy user trong DB (dù token hợp lệ - trường hợp user bị xóa)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không còn tồn tại'
      });
    }

    // 5. Gán user đầy đủ vào req.user
    // Lúc này req.user.taixe sẽ có dữ liệu
    req.user = user;

    // Bổ sung role từ token vào req.user nếu trong DB chưa xử lý logic role
    if (!req.user.role && decoded.role) {
      req.user.role = decoded.role;
    }

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực server'
    });
  }
};

// Middleware kiểm tra role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    // Logic kiểm tra Role:
    // Vì DB của bạn không có cột 'role' trong bảng User,
    // ta sẽ kiểm tra dựa trên việc user có tồn tại trong các bảng con không.

    let userRole = 'user'; // Mặc định
    if (req.user.quanlyxebuyt) userRole = 'school'; // School manager
    else if (req.user.taixe) userRole = 'driver';
    else if (req.user.phuhuynh) userRole = 'parent';

    // Nếu bạn đã lưu role trong token lúc login, có thể dùng: const roleToCheck = req.user.role || userRole;
    const roleToCheck = req.user.role || userRole;

    console.log('=== Authorization Check ===');
    console.log('User:', req.user.email);
    console.log('Required roles:', roles);
    console.log('User role:', roleToCheck);
    console.log('Has quanlyxebuyt:', !!req.user.quanlyxebuyt);
    console.log('Has taixe:', !!req.user.taixe);
    console.log('Has phuhuynh:', !!req.user.phuhuynh);

    if (!roles.includes(roleToCheck)) {
      return res.status(403).json({
        success: false,
        message: `Role hiện tại là '${roleToCheck}'. Chỉ ${roles.join(', ')} mới có quyền truy cập.`
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};