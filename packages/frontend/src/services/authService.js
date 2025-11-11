// frontend/src/services/authService.js
import axios from "axios";
import { startAutoLogoutTimer, clearAutoLogoutTimer } from "../utils/autoLogout";

const API_URL = "http://localhost:5000/api/auth";

// Tạo axios instance riêng để tránh conflict với global axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ===== REQUEST INTERCEPTOR =====
// Tự động thêm token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// Xử lý khi token hết hạn (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("❌ Token hết hạn hoặc không hợp lệ (401)");

      // Xóa dữ liệu
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("justLoggedIn");

      // Dừng auto logout timer
      clearAutoLogoutTimer();

      // Chỉ redirect nếu không phải trang login
      if (window.location.pathname !== "/login") {
        // Lưu flag để hiển thị thông báo
        localStorage.setItem("sessionExpired", "true");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ===== AUTH SERVICE =====
const authService = {
  /**
   * ĐĂNG NHẬP
   */
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Lưu vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("justLoggedIn", "true");

        console.log("✅ Đăng nhập thành công, bắt đầu auto logout timer");

        // BẮT ĐẦU AUTO LOGOUT TIMER
        startAutoLogoutTimer();
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng nhập thất bại"
      };
    }
  },

  /**
   * ĐĂNG XUẤT
   */
  logout: async () => {
    try {
      // Gọi API logout (nếu backend có endpoint này)
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout API error:", error);
      // Vẫn tiếp tục logout ở client
    } finally {
      // Xóa dữ liệu
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("justLoggedIn");

      console.log("🔴 Đăng xuất, dừng auto logout timer");

      // DỪNG AUTO LOGOUT TIMER
      clearAutoLogoutTimer();

      // Redirect về login
      window.location.href = "/login";
    }
  },

  /**
   * LẤY THÔNG TIN USER TỪ LOCALSTORAGE
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  /**
   * LẤY THÔNG TIN USER TỪ SERVER (refresh data)
   */
  fetchCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/me");

      if (response.data.success) {
        const user = response.data.user || response.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      }

      return null;
    } catch (error) {
      console.error("Fetch current user error:", error);
      return authService.getCurrentUser();
    }
  },

  /**
   * LẤY TOKEN
   */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /**
   * KIỂM TRA ĐÃ ĐĂNG NHẬP
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * KIỂM TRA ROLE CỤ THỂ
   */
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  /**
   * KIỂM TRA CÓ MỘT TRONG CÁC ROLE
   */
  hasAnyRole: (roles) => {
    const user = authService.getCurrentUser();
    return roles.includes(user?.role);
  },

  /**
   * KHỞI ĐỘNG LẠI AUTO LOGOUT (dùng khi refresh page)
   */
  initAutoLogout: () => {
    if (authService.isAuthenticated()) {
      console.log("🔄 Khởi động lại auto logout timer sau khi refresh");
      startAutoLogoutTimer();
    }
  }
};

export default authService;