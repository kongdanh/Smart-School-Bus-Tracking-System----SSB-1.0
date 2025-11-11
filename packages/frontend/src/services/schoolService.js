// frontend/src/services/schoolService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SCHOOL_API_URL = `${API_URL}/school`;

// ===== TẠO AXIOS INSTANCE RIÊNG =====
const axiosInstance = axios.create({
  baseURL: SCHOOL_API_URL,
  timeout: 15000, // 15 giây
  headers: {
    'Content-Type': 'application/json'
  }
});

// ===== REQUEST INTERCEPTOR: Thêm token =====
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("School service request error:", error);
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR: Xử lý lỗi =====
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("School service API error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

// ===== HELPER: Xử lý error và fallback =====
const handleApiCall = async (apiCall, fallbackData = null) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);

    // Nếu là lỗi network/timeout/404 và có fallback data → trả về fallback
    if (fallbackData && (
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.response?.status === 404 ||
      error.response?.status === 500
    )) {
      console.warn("⚠️ Using fallback data");
      return fallbackData;
    }

    // Các lỗi khác → throw để component xử lý
    throw error;
  }
};

// ===== SCHOOL SERVICE =====
const schoolService = {
  // ==================== DASHBOARD ====================
  getDashboard: async () => {
    return handleApiCall(
      () => axiosInstance.get("/dashboard"),
      // Fallback data nếu API chưa có
      {
        success: true,
        data: {
          statistics: {
            totalStudents: 150,
            activeBuses: 8,
            totalBuses: 10,
            onTimeDrivers: 12,
            totalDrivers: 15,
            routes: 5
          },
          recentActivities: [
            {
              id: 1,
              type: "success",
              icon: "✅",
              message: "Xe BUS-01 đã hoàn thành tuyến Quận 1",
              time: "5 phút trước"
            },
            {
              id: 2,
              type: "warning",
              icon: "⚠️",
              message: "Xe BUS-03 chậm 10 phút so với lịch trình",
              time: "15 phút trước"
            },
            {
              id: 3,
              type: "info",
              icon: "📍",
              message: "Cập nhật vị trí xe BUS-05",
              time: "30 phút trước"
            },
            {
              id: 4,
              type: "success",
              icon: "👨‍✈️",
              message: "Tài xế Nguyễn Văn A đã bắt đầu ca làm việc",
              time: "1 giờ trước"
            }
          ]
        }
      }
    );
  },

  // ==================== HỌC SINH ====================
  getAllStudents: async () => {
    return handleApiCall(
      () => axiosInstance.get("/students"),
      // Fallback
      {
        success: true,
        data: [
          {
            id: 1,
            hoTen: "Nguyễn Văn A",
            lop: "10A1",
            dienThoaiPH: "0901234567",
            diaChi: "123 Lê Lợi, Q1, TP.HCM",
            tuyen: "Tuyến 1"
          },
          {
            id: 2,
            hoTen: "Trần Thị B",
            lop: "11B2",
            dienThoaiPH: "0912345678",
            diaChi: "456 Nguyễn Huệ, Q1, TP.HCM",
            tuyen: "Tuyến 2"
          }
        ]
      }
    );
  },

  getStudentById: async (id) => {
    return handleApiCall(() => axiosInstance.get(`/students/${id}`));
  },

  createStudent: async (studentData) => {
    return handleApiCall(() => axiosInstance.post("/students", studentData));
  },

  updateStudent: async (id, studentData) => {
    return handleApiCall(() => axiosInstance.put(`/students/${id}`, studentData));
  },

  deleteStudent: async (id) => {
    return handleApiCall(() => axiosInstance.delete(`/students/${id}`));
  },

  // ==================== TÀI XẾ ====================
  getAllDrivers: async () => {
    return handleApiCall(
      () => axiosInstance.get("/drivers"),
      // Fallback
      {
        success: true,
        data: [
          {
            id: 1,
            hoTen: "Nguyễn Văn Nam",
            soDienThoai: "0909123456",
            bienSoXe: "51A-12345",
            trangThai: "Đang hoạt động"
          },
          {
            id: 2,
            hoTen: "Trần Văn Bình",
            soDienThoai: "0908234567",
            bienSoXe: "51B-67890",
            trangThai: "Nghỉ"
          }
        ]
      }
    );
  },

  getDriverById: async (id) => {
    return handleApiCall(() => axiosInstance.get(`/drivers/${id}`));
  },

  // ==================== XE BUÝT ====================
  getAllBuses: async () => {
    return handleApiCall(
      () => axiosInstance.get("/buses"),
      // Fallback
      {
        success: true,
        data: [
          {
            id: 1,
            bienSo: "51A-12345",
            soGhe: 45,
            trangThai: "Đang hoạt động",
            taiXe: "Nguyễn Văn Nam"
          },
          {
            id: 2,
            bienSo: "51B-67890",
            soGhe: 40,
            trangThai: "Bảo trì",
            taiXe: "Trần Văn Bình"
          }
        ]
      }
    );
  },

  getBusById: async (id) => {
    return handleApiCall(() => axiosInstance.get(`/buses/${id}`));
  },

  createBus: async (busData) => {
    return handleApiCall(() => axiosInstance.post("/buses", busData));
  },

  updateBus: async (id, busData) => {
    return handleApiCall(() => axiosInstance.put(`/buses/${id}`, busData));
  },

  deleteBus: async (id) => {
    return handleApiCall(() => axiosInstance.delete(`/buses/${id}`));
  },

  // ==================== TUYẾN ĐƯỜNG ====================
  getAllRoutes: async () => {
    return handleApiCall(
      () => axiosInstance.get("/routes"),
      // Fallback
      {
        success: true,
        data: [
          {
            id: 1,
            tenTuyen: "Tuyến 1 - Quận 1",
            diemDi: "Trường THPT ABC",
            diemDen: "Khu dân cư X",
            khoangCach: "12 km",
            soHocSinh: 35
          },
          {
            id: 2,
            tenTuyen: "Tuyến 2 - Quận 3",
            diemDi: "Trường THPT ABC",
            diemDen: "Khu dân cư Y",
            khoangCach: "8 km",
            soHocSinh: 28
          }
        ]
      }
    );
  },

  // ==================== LỊCH TRÌNH ====================
  getAllSchedules: async () => {
    return handleApiCall(
      () => axiosInstance.get("/schedules"),
      // Fallback
      {
        success: true,
        data: [
          {
            id: 1,
            bienSo: "51A-12345",
            tuyen: "Tuyến 1",
            gioDi: "06:30",
            gioDen: "07:15"
          },
          {
            id: 2,
            bienSo: "51B-67890",
            tuyen: "Tuyến 2",
            gioDi: "06:45",
            gioDen: "07:30"
          }
        ]
      }
    );
  },

  // ==================== TRACKING ====================
  getAllBusLocations: async () => {
    return handleApiCall(
      () => axiosInstance.get("/tracking"),
      // Fallback
      {
        success: true,
        data: [
          {
            id: 1,
            bienSo: "51A-12345",
            viTri: { lat: 10.7769, lng: 106.7009 },
            tocDo: 35,
            trangThai: "Đang di chuyển"
          },
          {
            id: 2,
            bienSo: "51B-67890",
            viTri: { lat: 10.7626, lng: 106.6822 },
            tocDo: 0,
            trangThai: "Đang dừng"
          }
        ]
      }
    );
  }
};

export default schoolService;