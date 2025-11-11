// backend/controller/parentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy thông tin phụ huynh hiện tại
exports.getCurrentParent = async (req, res) => {
  try {
    const userId = req.user.userId; // Từ middleware

    const parent = await prisma.phuhuynh.findUnique({
      where: {
        userId: userId
      },
      include: {
        user: {
          select: {
            hoTen: true,
            soDienThoai: true,
            email: true,
            userCode: true
          }
        },
        hocsinh: true
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
      data: parent
    });
  } catch (error) {
    console.error('Get current parent error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin phụ huynh'
    });
  }
};

// Lấy danh sách con của phụ huynh
exports.getMyChildren = async (req, res) => {
  try {
    const userId = req.user.userId;

    const parent = await prisma.phuhuynh.findUnique({
      where: { userId },
      include: {
        hocsinh: true
      }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phụ huynh'
      });
    }

    res.json({
      success: true,
      data: parent.hocsinh
    });
  } catch (error) {
    console.error('Get my children error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách con'
    });
  }
};

// Lấy vị trí xe của con
exports.getChildBusLocation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { studentId } = req.params;

    // Kiểm tra học sinh có phải con của phụ huynh này không
    const student = await prisma.hocsinh.findFirst({
      where: {
        hocSinhId: parseInt(studentId),
        phuhuynh: {
          userId: userId
        }
      }
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem thông tin học sinh này'
      });
    }

    // Lấy lịch trình hôm nay của học sinh
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedule = await prisma.lichtrinh.findFirst({
      where: {
        ngay: today
        // TODO: Cần thêm logic để tìm lịch trình của học sinh cụ thể
      },
      include: {
        xebuyt: {
          include: {
            vitri: {
              orderBy: {
                thoiGian: 'desc'
              },
              take: 1
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

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch trình hôm nay'
      });
    }

    res.json({
      success: true,
      data: {
        student: student,
        bus: schedule.xebuyt,
        location: schedule.xebuyt.vitri[0] || null,
        route: schedule.tuyenduong,
        driver: schedule.taixe
      }
    });
  } catch (error) {
    console.error('Get child bus location error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy vị trí xe'
    });
  }
};

// Lấy lịch trình xe đưa đón của con
exports.getChildSchedule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { studentId } = req.params;

    // Kiểm tra quyền
    const student = await prisma.hocsinh.findFirst({
      where: {
        hocSinhId: parseInt(studentId),
        phuhuynh: {
          userId: userId
        }
      }
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem lịch trình này'
      });
    }

    // Lấy lịch trình (giả sử tất cả học sinh cùng tuyến)
    const schedules = await prisma.lichtrinh.findMany({
      where: {
        ngay: {
          gte: new Date()
        }
      },
      include: {
        xebuyt: true,
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
      orderBy: {
        ngay: 'asc'
      },
      take: 10
    });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Get child schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch trình'
    });
  }
};

// Lấy thông báo
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const parent = await prisma.phuhuynh.findUnique({
      where: { userId }
    });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phụ huynh'
      });
    }

    const notifications = await prisma.thongbao.findMany({
      where: {
        phuHuynhId: parent.phuHuynhId
      },
      orderBy: {
        thoiGianGui: 'desc'
      }
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

// Đánh dấu đã đọc thông báo
exports.markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    // Kiểm tra quyền
    const notification = await prisma.thongbao.findFirst({
      where: {
        thongBaoId: parseInt(notificationId),
        phuhuynh: {
          userId: userId
        }
      }
    });

    if (!notification) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền với thông báo này'
      });
    }

    // TODO: Thêm trường daDoc vào schema nếu cần
    res.json({
      success: true,
      message: 'Đánh dấu đã đọc thành công'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu thông báo'
    });
  }
};

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});