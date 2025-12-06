// backend/controller/schoolController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dashboard - Thống kê tổng quan
exports.getDashboard = async (req, res) => {
  try {
    // Đếm số lượng
    const [
      totalStudents,
      totalBuses,
      totalDrivers,
      totalRoutes,
      activeBuses,
      activeDrivers
    ] = await Promise.all([
      prisma.hocsinh.count(),
      prisma.xebuyt.count(),
      prisma.taixe.count(),
      prisma.tuyenduong.count(),
      prisma.xebuyt.count({
        where: {
          trangThai: 'Đang hoạt động'
        }
      }),
      prisma.taixe.count({
        where: {
          trangThai: 'Đang hoạt động'
        }
      })
    ]);

    // Lịch trình hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySchedules = await prisma.lichtrinh.count({
      where: {
        ngay: today
      }
    });

    // Hoạt động gần đây (dựa trên lịch trình)
    const recentActivities = await prisma.lichtrinh.findMany({
      where: {
        ngay: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 giờ qua
        }
      },
      include: {
        xebuyt: true,
        taixe: {
          include: {
            user: {
              select: {
                hoTen: true
              }
            }
          }
        },
        tuyenduong: true
      },
      orderBy: {
        ngay: 'desc'
      },
      take: 10
    });

    // Format activities for frontend
    const formattedActivities = recentActivities.map(activity => {
      let message = '';
      let type = 'info';
      let icon = 'ℹ️';

      if (activity.trangThai === 'completed') {
        message = `Chuyến xe ${activity.xebuyt?.bienSoXe || 'N/A'} đã hoàn thành lộ trình ${activity.tuyenduong?.tenTuyen || 'N/A'}`;
        type = 'success';
        icon = '✅';
      } else if (activity.trangThai === 'in_progress') {
        message = `Tài xế ${activity.taixe?.user?.hoTen || 'N/A'} đang chạy tuyến ${activity.tuyenduong?.tenTuyen || 'N/A'}`;
        type = 'warning';
        icon = '🚌';
      } else {
        message = `Lịch trình mới cho xe ${activity.xebuyt?.bienSoXe || 'N/A'} trên tuyến ${activity.tuyenduong?.tenTuyen || 'N/A'}`;
        type = 'info';
        icon = '📅';
      }

      return {
        id: activity.lichTrinhId,
        type,
        icon,
        message,
        time: new Date(activity.ngay).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
    });

    res.json({
      success: true,
      data: {
        statistics: {
          totalStudents,
          totalBuses,
          activeBuses,
          totalDrivers,
          onTimeDrivers: activeDrivers,
          routes: totalRoutes,
          todaySchedules
        },
        recentActivities: formattedActivities
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function: Format thời gian
function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // seconds

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

// ==================== HỌC SINH ====================

// Lấy danh sách tất cả học sinh
exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.hocsinh.findMany({
      include: {
        phuhuynh: {
          include: {
            user: {
              select: {
                hoTen: true,
                soDienThoai: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        hoTen: 'asc'
      }
    });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách học sinh'
    });
  }
};

// Lấy thông tin 1 học sinh
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.hocsinh.findUnique({
      where: {
        hocSinhId: parseInt(id)
      },
      include: {
        phuhuynh: {
          include: {
            user: {
              select: {
                hoTen: true,
                soDienThoai: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học sinh'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin học sinh'
    });
  }
};

// Thêm học sinh mới
exports.createStudent = async (req, res) => {
  try {
    const { maHS, hoTen, lop, diemDon, diemTra, phuHuynhId } = req.body;

    const student = await prisma.hocsinh.create({
      data: {
        maHS,
        hoTen,
        lop,
        diemDon,
        diemTra,
        phuHuynhId: phuHuynhId ? parseInt(phuHuynhId) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thêm học sinh thành công',
      data: student
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm học sinh'
    });
  }
};

// Cập nhật học sinh
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { maHS, hoTen, lop, diemDon, diemTra, phuHuynhId } = req.body;

    const student = await prisma.hocsinh.update({
      where: {
        hocSinhId: parseInt(id)
      },
      data: {
        maHS,
        hoTen,
        lop,
        diemDon,
        diemTra,
        phuHuynhId: phuHuynhId ? parseInt(phuHuynhId) : null
      }
    });

    res.json({
      success: true,
      message: 'Cập nhật học sinh thành công',
      data: student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật học sinh'
    });
  }
};

// Xóa học sinh
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.hocsinh.delete({
      where: {
        hocSinhId: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: 'Xóa học sinh thành công'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa học sinh'
    });
  }
};

// ==================== TÀI XẾ ====================

// Lấy danh sách tất cả tài xế
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await prisma.taixe.findMany({
      include: {
        user: {
          select: {
            userCode: true,
            hoTen: true,
            soDienThoai: true,
            email: true
          }
        },
        lichtrinh: {
          where: {
            ngay: {
              gte: new Date()
            }
          },
          include: {
            xebuyt: true,
            tuyenduong: true
          },
          take: 5,
          orderBy: {
            ngay: 'asc'
          }
        }
      },
      orderBy: {
        hoTen: 'asc'
      }
    });

    res.json({
      success: true,
      data: drivers
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tài xế'
    });
  }
};

// Lấy thông tin 1 tài xế
exports.getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await prisma.taixe.findUnique({
      where: {
        taiXeId: parseInt(id)
      },
      include: {
        user: {
          select: {
            userCode: true,
            hoTen: true,
            soDienThoai: true,
            email: true
          }
        },
        lichtrinh: {
          include: {
            xebuyt: true,
            tuyenduong: true
          },
          orderBy: {
            ngay: 'desc'
          }
        }
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài xế'
      });
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tài xế'
    });
  }
};

// ==================== XE BUÝT ====================

// Lấy danh sách tất cả xe buýt
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await prisma.xebuyt.findMany({
      include: {
        lichtrinh: {
          include: {
            taixe: {
              include: {
                user: {
                  select: {
                    hoTen: true
                  }
                }
              }
            },
            tuyenduong: true
          },
          orderBy: {
            ngay: 'desc'
          },
          take: 1
        },
        vitri: {
          orderBy: {
            thoiGian: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        maXe: 'asc'
      }
    });

    res.json({
      success: true,
      data: buses
    });
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách xe'
    });
  }
};

// Lấy thông tin 1 xe buýt
exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await prisma.xebuyt.findUnique({
      where: {
        xeBuytId: parseInt(id)
      },
      include: {
        lichtrinh: {
          include: {
            taixe: {
              include: {
                user: true
              }
            },
            tuyenduong: true
          },
          orderBy: {
            ngay: 'desc'
          }
        },
        vitri: {
          orderBy: {
            thoiGian: 'desc'
          },
          take: 10
        }
      }
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe buýt'
      });
    }

    res.json({
      success: true,
      data: bus
    });
  } catch (error) {
    console.error('Get bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin xe'
    });
  }
};

// Thêm xe buýt mới
exports.createBus = async (req, res) => {
  try {
    const { maXe, bienSo, sucChua, trangThai } = req.body;

    // Kiểm tra trùng maXe
    const existingBus = await prisma.xebuyt.findUnique({
      where: { maXe }
    });

    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: 'Mã xe đã tồn tại'
      });
    }

    const bus = await prisma.xebuyt.create({
      data: {
        maXe,
        bienSo,
        sucChua: parseInt(sucChua),
        trangThai: trangThai || 'Đang hoạt động'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thêm xe buýt thành công',
      data: bus
    });
  } catch (error) {
    console.error('Create bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm xe buýt'
    });
  }
};

// Cập nhật xe buýt
exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { maXe, bienSo, sucChua, trangThai } = req.body;

    const bus = await prisma.xebuyt.update({
      where: { xeBuytId: parseInt(id) },
      data: {
        maXe,
        bienSo,
        sucChua: parseInt(sucChua),
        trangThai
      }
    });

    res.json({
      success: true,
      message: 'Cập nhật xe buýt thành công',
      data: bus
    });
  } catch (error) {
    console.error('Update bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật xe buýt'
    });
  }
};

// Xóa xe buýt
exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.xebuyt.delete({
      where: { xeBuytId: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Xóa xe buýt thành công'
    });
  } catch (error) {
    console.error('Delete bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa xe buýt'
    });
  }
};

// ==================== TUYẾN ĐƯỜNG ====================

// Lấy danh sách tuyến đường
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await prisma.tuyenduong.findMany({
      include: {
        tuyenduong_diemdung: {
          include: {
            diemdung: true
          },
          orderBy: {
            thuTu: 'asc'
          }
        },
        lichtrinh: {
          take: 5,
          orderBy: {
            ngay: 'desc'
          }
        }
      },
      orderBy: {
        maTuyen: 'asc'
      }
    });

    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tuyến'
    });
  }
};

// ==================== LỊCH TRÌNH ====================

// Lấy danh sách lịch trình
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.lichtrinh.findMany({
      include: {
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
        },
        xebuyt: true
      },
      orderBy: [
        { ngay: 'desc' },
        { gioKhoiHanh: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách lịch trình'
    });
  }
};

// ==================== TRACKING ====================

// Lấy vị trí tất cả xe (real-time tracking)
exports.getAllBusLocations = async (req, res) => {
  try {
    const buses = await prisma.xebuyt.findMany({
      where: {
        trangThai: 'Đang hoạt động'
      },
      include: {
        vitri: {
          orderBy: {
            thoiGian: 'desc'
          },
          take: 1
        },
        lichtrinh: {
          where: {
            ngay: new Date()
          },
          include: {
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
        }
      }
    });

    res.json({
      success: true,
      data: buses
    });
  } catch (error) {
    console.error('Get bus locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy vị trí xe'
    });
  }
};

// ==================== ROUTES ====================
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await prisma.tuyenduong.findMany({
      include: {
        tuyenduong_diemdung: {
          include: {
            diemdung: true
          },
          orderBy: {
            thuTu: 'asc'
          }
        },
        lichtrinh: {
          take: 5,
          orderBy: {
            ngay: 'desc'
          }
        }
      }
    });

    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    console.error('Get all routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tuyến'
    });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await prisma.tuyenduong.findUnique({
      where: {
        tuyenDuongId: parseInt(id)
      },
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
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tuyến đường'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Get route by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tuyến'
    });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const { maTuyen, tenTuyen } = req.body;

    if (!maTuyen || !tenTuyen) {
      return res.status(400).json({
        success: false,
        message: 'Mã tuyến và tên tuyến là bắt buộc'
      });
    }

    const existingRoute = await prisma.tuyenduong.findUnique({
      where: { maTuyen }
    });

    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: 'Mã tuyến đã tồn tại'
      });
    }

    const route = await prisma.tuyenduong.create({
      data: {
        maTuyen,
        tenTuyen,
        trangThai: 'active'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Tạo tuyến thành công',
      data: route
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo tuyến'
    });
  }
};

exports.getRouteStops = async (req, res) => {
  try {
    const { routeId } = req.params;
    const stops = await prisma.tuyenduong_diemdung.findMany({
      where: {
        tuyenDuongId: parseInt(routeId)
      },
      include: {
        diemdung: true
      },
      orderBy: {
        thuTu: 'asc'
      }
    });

    res.json({
      success: true,
      data: stops
    });
  } catch (error) {
    console.error('Get route stops error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy điểm dừng'
    });
  }
};

exports.addStopToRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { diemDungId, tenDiemDung, diaChi, vido, kinhdo, thuTu } = req.body;

    let stopId = diemDungId;

    // Nếu không có diemDungId, tạo điểm dừng mới
    if (!diemDungId && tenDiemDung) {
      const newStop = await prisma.diemdung.create({
        data: {
          tenDiemDung,
          diaChi: diaChi || null,
          vido: vido ? parseFloat(vido) : null,
          kinhdo: kinhdo ? parseFloat(kinhdo) : null
        }
      });
      stopId = newStop.diemDungId;
    }

    if (!stopId) {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp diemDungId hoặc thông tin điểm dừng mới'
      });
    }

    const routeStop = await prisma.tuyenduong_diemdung.create({
      data: {
        tuyenDuongId: parseInt(routeId),
        diemDungId: parseInt(stopId),
        thuTu: parseInt(thuTu) || 1
      },
      include: {
        diemdung: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thêm điểm dừng thành công',
      data: routeStop
    });
  } catch (error) {
    console.error('Add stop to route error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm điểm dừng'
    });
  }
};

exports.getAllStops = async (req, res) => {
  try {
    const stops = await prisma.diemdung.findMany({
      orderBy: {
        tenDiemDung: 'asc'
      }
    });

    res.json({
      success: true,
      data: stops
    });
  } catch (error) {
    console.error('Get all stops error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách điểm dừng'
    });
  }
};

// ==================== SCHEDULES ====================
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.lichtrinh.findMany({
      include: {
        tuyenduong: true,
        taixe: {
          include: {
            user: true
          }
        },
        xebuyt: true
      },
      orderBy: [
        { ngay: 'desc' },
        { gioKhoiHanh: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Get all schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch trình'
    });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { maLich, ngay, gioKhoiHanh, gioKetThuc, tuyenDuongId, taiXeId, xeBuytId } = req.body;

    if (!maLich || !ngay) {
      return res.status(400).json({
        success: false,
        message: 'Mã lịch và ngày là bắt buộc'
      });
    }

    const existingSchedule = await prisma.lichtrinh.findUnique({
      where: { maLich }
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: 'Mã lịch đã tồn tại'
      });
    }

    const schedule = await prisma.lichtrinh.create({
      data: {
        maLich,
        ngay: new Date(ngay),
        gioKhoiHanh: gioKhoiHanh ? new Date(`1970-01-01T${gioKhoiHanh}`) : null,
        gioKetThuc: gioKetThuc ? new Date(`1970-01-01T${gioKetThuc}`) : null,
        tuyenDuongId: tuyenDuongId ? parseInt(tuyenDuongId) : null,
        taiXeId: taiXeId ? parseInt(taiXeId) : null,
        xeBuytId: xeBuytId ? parseInt(xeBuytId) : null,
        trangThai: 'scheduled'
      },
      include: {
        tuyenduong: true,
        taixe: {
          include: {
            user: true
          }
        },
        xebuyt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Tạo lịch trình thành công',
      data: schedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo lịch trình'
    });
  }
};

exports.assignStudentToSchedule = async (req, res) => {
  try {
    const { scheduleId, studentId } = req.params;

    const attendance = await prisma.attendance.create({
      data: {
        lichTrinhId: parseInt(scheduleId),
        hocSinhId: parseInt(studentId),
        taiXeId: 1, // Default value, should be from schedule
        loanDon: false,
        loanTra: false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thêm học sinh vào lịch trình thành công',
      data: attendance
    });
  } catch (error) {
    console.error('Assign student to schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm học sinh'
    });
  }
};

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});