// backend/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hàm xác định role dựa trên userCode
const getRoleFromUserCode = (userCode) => {
  if (!userCode) return null;

  // Hỗ trợ ADMIN
  if (userCode.toUpperCase() === 'ADMIN') {
    return 'school'; // Admin có quyền như school admin
  }

  const prefix = userCode.substring(0, 2).toUpperCase();
  const roleMap = { 'QL': 'school', 'PH': 'parent', 'TX': 'driver' };
  return roleMap[prefix] || null;
};

// Hàm kiểm tra user có tồn tại trong bảng role tương ứng
const checkUserRole = async (userId, role, userCode) => {
  try {
    // ADMIN có thể bypass kiểm tra role
    if (userCode && userCode.toUpperCase() === 'ADMIN') {
      return true;
    }

    switch (role) {
      case 'school':
        const qlxb = await prisma.quanlyxebuyt.findUnique({ where: { userId } });
        return !!qlxb;
      case 'parent':
        const parent = await prisma.phuhuynh.findUnique({ where: { userId } });
        return !!parent;
      case 'driver':
        const driver = await prisma.taixe.findUnique({ where: { userId } });
        return !!driver;
      default:
        return false;
    }
  } catch (error) {
    return false;
  }
};

// ================ CONTROLLER FUNCTIONS ================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu'
      });
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // DEBUG: In ra giá trị matKhau
    console.log('🔍 DEBUG - Email:', email);
    console.log('🔍 DEBUG - matKhau from DB:', user.matKhau);
    console.log('🔍 DEBUG - matKhau type:', typeof user.matKhau);
    console.log('🔍 DEBUG - matKhau is null?', user.matKhau === null);
    console.log('🔍 DEBUG - matKhau is undefined?', user.matKhau === undefined);

    // Kiểm tra xem matKhau có tồn tại không
    if (!user.matKhau) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản chưa được thiết lập mật khẩu'
      });
    }

    // Kiểm tra password - dùng matKhau thay vì password
    let isPasswordValid = false;

    // Kiểm tra xem password có được hash không (bắt đầu với $2a$ hoặc $2b$)
    if (user.matKhau.startsWith('$2a$') || user.matKhau.startsWith('$2b$')) {
      // Password đã hash - dùng bcrypt.compare
      isPasswordValid = await bcrypt.compare(password, user.matKhau);
    } else {
      // Password plain text - CHỈ DÙNG CHO DEVELOPMENT
      isPasswordValid = user.matKhau === password;
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const role = getRoleFromUserCode(user.userCode);
    if (!role) {
      return res.status(403).json({
        success: false,
        message: 'Mã người dùng không hợp lệ'
      });
    }

    const hasRole = await checkUserRole(user.userId, role, user.userCode);
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Người dùng không có quyền ${role}`
      });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role, hoTen: user.hoTen },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          userId: user.userId,
          email: user.email,
          userCode: user.userCode,
          hoTen: user.hoTen,
          soDienThoai: user.soDienThoai,
          role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { userId: true, userCode: true, hoTen: true, soDienThoai: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    let roleData = null;
    switch (role) {
      case 'school':
        roleData = await prisma.quanlyxebuyt.findUnique({ where: { userId } });
        break;
      case 'parent':
        roleData = await prisma.phuhuynh.findUnique({ where: { userId }, include: { hocsinh: true } });
        break;
      case 'driver':
        roleData = await prisma.taixe.findUnique({
          where: { userId },
          include: { lichtrinh: { include: { tuyenduong: true, xebuyt: true } } }
        });
        break;
    }

    res.json({
      success: true,
      user: { ...user, role, roleData }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ================ EXPORT ================
module.exports = {
  login,
  getCurrentUser
};