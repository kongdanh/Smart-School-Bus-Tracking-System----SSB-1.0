// backend/controller/authController.js
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hàm xác định role dựa trên userCode
const getRoleFromUserCode = (userCode) => {
  if (!userCode) return null;
  
  const prefix = userCode.substring(0, 2).toUpperCase();
  
  const roleMap = {
    'QL': 'school',    // Quản lý xe buýt
    'PH': 'parent',    // Phụ huynh
    'TX': 'driver'     // Tài xế
  };
  
  return roleMap[prefix] || null;
};

// Hàm kiểm tra user có tồn tại trong bảng role tương ứng
const checkUserRole = async (userId, role) => {
  try {
    switch (role) {
      case 'school':
        const qlxb = await prisma.quanlyxebuyt.findUnique({
          where: { userId: userId }
        });
        return !!qlxb;
        
      case 'parent':
        const parent = await prisma.phuhuynh.findUnique({
          where: { userId: userId }
        });
        return !!parent;
        
      case 'driver':
        const driver = await prisma.taixe.findUnique({
          where: { userId: userId }
        });
        return !!driver;
        
      default:
        return false;
    }
  } catch (error) {
    return false;
  }
};

// API Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu'
      });
    }

    // Tìm user trong bảng user
    const user = await prisma.user.findFirst({
      where: { email: email }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra mật khẩu (giả sử password chưa mã hóa trong DB)
    // Nếu đã mã hóa, dùng: const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user.email || user.email !== email) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạm thời kiểm tra password đơn giản (nếu bạn chưa có trường password)
    // Bạn cần thêm trường password vào bảng user
    
    // Xác định role từ userCode
    const role = getRoleFromUserCode(user.userCode);
    
    if (!role) {
      return res.status(403).json({
        success: false,
        message: 'Mã người dùng không hợp lệ'
      });
    }

    // Kiểm tra user có tồn tại trong bảng role tương ứng
    const hasRole = await checkUserRole(user.userId, role);
    
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Người dùng không có quyền ${role}`
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        userId: user.userId,
        email: user.email,
        userCode: user.userCode,
        role: role,
        hoTen: user.hoTen
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Trả về thông tin user và token
    res.status(200).json({
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
          role: role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// API kiểm tra user hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const user = await prisma.user.findUnique({
      where: { userId: userId },
      select: {
        userId: true,
        userCode: true,
        hoTen: true,
        soDienThoai: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Lấy thông tin chi tiết theo role
    let roleData = null;
    
    switch (role) {
      case 'school':
        roleData = await prisma.quanlyxebuyt.findUnique({
          where: { userId: userId }
        });
        break;
        
      case 'parent':
        roleData = await prisma.phuhuynh.findUnique({
          where: { userId: userId },
          include: {
            hocsinh: true
          }
        });
        break;
        
      case 'driver':
        roleData = await prisma.taixe.findUnique({
          where: { userId: userId },
          include: {
            lichtrinh: {
              include: {
                tuyenduong: true,
                xebuyt: true
              }
            }
          }
        });
        break;
    }

    res.json({
      success: true,
      user: {
        ...user,
        role: role,
        roleData: roleData
      }
    });
    
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Đóng Prisma connection
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});