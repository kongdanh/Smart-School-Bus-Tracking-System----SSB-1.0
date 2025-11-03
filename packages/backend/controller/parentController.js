// backend/controller/parentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy danh sách con của phụ huynh
exports.getChildren = async (req, res) => {
  try {
    const { userId } = req.user;

    // Tìm phụ huynh theo userId
    const parent = await prisma.phuhuynh.findUnique({
      where: { userId: userId },
      include: {
        hocsinh: true,
        user: {
          select: {
            hoTen: true,
            soDienThoai: true,
            email: true
          }
        }
      }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin phụ huynh'
      });
    }

    res.json({
      success: true,
      data: {
        parent: {
          phuHuynhId: parent.phuHuynhId,
          hoTen: parent.user.hoTen,
          soDienThoai: parent.user.soDienThoai,
          email: parent.user.email
        },
        children: parent.hocsinh
      }
    });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách con',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Lấy thông tin 1 học sinh cụ thể
exports.getChildById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    // Tìm phụ huynh
    const parent = await prisma.phuhuynh.findUnique({
      where: { userId: userId }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin phụ huynh'
      });
    }

    // Tìm học sinh và kiểm tra có thuộc phụ huynh này không
    const student = await prisma.hocsinh.findFirst({
      where: {
        hocSinhId: parseInt(id),
        phuHuynhId: parent.phuHuynhId
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học sinh hoặc không có quyền truy cập'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get child error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin học sinh'
    });
  }
};

// Lấy lịch trình xe buýt
exports.getSchedule = async (req, res) => {
  try {
    const { userId } = req.user;

    // Lấy thông tin phụ huynh và học sinh
    const parent = await prisma.phuhuynh.findUnique({
      where: { userId: userId },
      include: {
        hocsinh: true
      }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin phụ huynh'
      });
    }

    // Lấy tất cả lịch trình từ hôm nay trở đi
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedules = await prisma.lichtrinh.findMany({
      where: {
        ngay: {
          gte: today
        }
      },
      include: {
        tuyenduong: {
          include: {
            tuyenduong_diemdung: {
              include: {
                diemdung: true
              },
              orderBy: {
                thuTu: 'asc'
              }
            }
          }
        },
        xebuyt: true,
        taixe: {
          include: {
            user: {
              select: {
                hoTen: true,
                soDienThoai: true
              }
            }
          }
        }
      },
      orderBy: [
        { ngay: 'asc' },
        { gioKhoiHanh: 'asc' }
      ],
      take: 20
    });

    res.json({
      success: true,
      data: {
        children: parent.hocsinh,
        schedules: schedules
      }
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch trình'
    });
  }
};

// Lấy vị trí xe buýt hiện tại
exports.getBusLocation = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lấy các lịch trình hôm nay
    const todaySchedules = await prisma.lichtrinh.findMany({
      where: {
        ngay: today
      },
      include: {
        xebuyt: {
          include: {
            vitri: {
              orderBy: {
                thoiGian: 'desc'
              },
              take: 1 // Chỉ lấy vị trí mới nhất
            }
          }
        },
        tuyenduong: true,
        taixe: {
          include: {
            user: {
              select: {
                hoTen: true,
                soDienThoai: true
              }
            }
          }
        }
      }
    });

    // Format data để dễ sử dụng hơn
    const busLocations = todaySchedules.map(schedule => ({
      lichTrinhId: schedule.lichTrinhId,
      maLich: schedule.maLich,
      gioKhoiHanh: schedule.gioKhoiHanh,
      gioKetThuc: schedule.gioKetThuc,
      tuyenDuong: schedule.tuyenduong?.tenTuyen,
      xe: {
        maXe: schedule.xebuyt?.maXe,
        bienSo: schedule.xebuyt?.bienSo
      },
      taiXe: {
        hoTen: schedule.taixe?.user?.hoTen,
        soDienThoai: schedule.taixe?.user?.soDienThoai
      },
      viTriHienTai: schedule.xebuyt?.vitri[0] || null
    }));

    res.json({
      success: true,
      data: busLocations
    });
  } catch (error) {
    console.error('Get bus location error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy vị trí xe'
    });
  }
};

// Lấy thông báo của phụ huynh
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.user;

    const parent = await prisma.phuhuynh.findUnique({
      where: { userId: userId }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin phụ huynh'
      });
    }

    const notifications = await prisma.thongbao.findMany({
      where: {
        phuHuynhId: parent.phuHuynhId
      },
      orderBy: {
        thoiGianGui: 'desc'
      },
      take: 50
    });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông báo'
    });
  }
};

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});