const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

exports.getMyChildren = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start, end } = getTodayRange();

    const parent = await prisma.phuhuynh.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!parent) return res.status(404).json({ success: false, message: 'Không tìm thấy phụ huynh' });

    const children = await prisma.hocsinh.findMany({
      where: { phuHuynhId: parent.phuHuynhId },
      include: {
        trips: {
          where: { lichtrinh: { ngay: { gte: start, lte: end } } },
          include: { lichtrinh: { include: { xebuyt: true, taixe: true } } }
        }
      }
    });

    const data = children.map(child => {
      const activeTrip = child.trips && child.trips.length > 0 ? child.trips[0] : null;
      const schedule = activeTrip?.lichtrinh;

      let status = 'home';
      if (activeTrip?.trangThai === 'picked_up') status = 'on-bus';
      else if (activeTrip?.trangThai === 'dropped_off') status = 'arrived';
      else if (schedule?.trangThai === 'in_progress') status = 'waiting';

      return {
        id: child.hocSinhId,
        name: child.hoTen || 'Học sinh',
        class: child.lop || 'N/A',
        status: status,
        pickupPoint: child.diemDon || 'N/A',
        busPlate: schedule?.xebuyt?.bienSo || 'Chưa phân công',
        driver: schedule?.taixe?.hoTen || 'Chưa phân công'
      };
    });

    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Get Children Error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// FIX: Đảm bảo routePath được format đúng
exports.getChildBusLocation = async (req, res) => {
  try {
    const { hocSinhId } = req.params;

    console.log("🔍 [Backend] Getting location for student:", hocSinhId);

    if (!hocSinhId || hocSinhId === 'undefined') {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const { start, end } = getTodayRange();

    // Tìm chuyến xe đang chạy
    const activeTrip = await prisma.studentTrip.findFirst({
      where: {
        hocSinhId: parseInt(hocSinhId),
        lichtrinh: {
          ngay: { gte: start, lte: end },
          trangThai: 'in_progress'
        }
      },
      include: {
        lichtrinh: {
          include: {
            xebuyt: true,
            taixe: true,
            tuyenduong: {
              include: {
                tuyenduong_diemdung: {
                  include: { diemdung: true },
                  orderBy: { thuTu: 'asc' }
                }
              }
            }
          }
        }
      }
    });

    console.log("🔍 [Backend] Active trip found:", !!activeTrip);

    if (!activeTrip) {
      return res.json({
        success: true,
        data: null,
        message: "Không có chuyến xe đang hoạt động"
      });
    }

    // Lấy vị trí GPS mới nhất
    const location = await prisma.vitri.findFirst({
      where: { xeBuytId: activeTrip.lichtrinh.xeBuytId },
      orderBy: { thoiGian: 'desc' }
    });

    console.log("🔍 [Backend] Latest GPS:", location ? `${location.vido}, ${location.kinhdo}` : "None");

    // Tạo routePath với validation cẩn thận
    const rawRoute = activeTrip.lichtrinh.tuyenduong?.tuyenduong_diemdung || [];

    console.log(`🔍 [Backend] Raw route stops: ${rawRoute.length}`);

    const routePoints = rawRoute
      .map((point, idx) => {
        const stop = {
          lat: point.diemdung?.vido,
          lng: point.diemdung?.kinhdo,
          name: point.diemdung?.tenDiemDung || `Điểm ${idx + 1}`,
          thuTu: point.thuTu
        };

        console.log(`  Stop ${idx}:`, stop);

        // Chỉ trả về nếu có tọa độ hợp lệ
        if (stop.lat && stop.lng) {
          return stop;
        }
        return null;
      })
      .filter(Boolean); // Lọc null

    console.log(`✅ [Backend] Valid route points: ${routePoints.length}`);

    const responseData = {
      lat: location?.vido || 10.7769,
      lng: location?.kinhdo || 106.7009,
      updatedAt: location?.thoiGian || new Date(),
      routePath: routePoints, // Array đã validated
      busInfo: {
        plate: activeTrip.lichtrinh.xebuyt?.bienSo || "Unknown",
        driver: activeTrip.lichtrinh.taixe?.hoTen || "Unknown",
        routeName: activeTrip.lichtrinh.tuyenduong?.tenTuyen || "Unknown"
      }
    };

    console.log("📤 [Backend] Sending response with", routePoints.length, "route points");

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("❌ [Backend] Tracking Error:", error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};