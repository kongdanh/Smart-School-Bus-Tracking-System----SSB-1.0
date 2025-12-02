// frontend/src/services/authService.js
import axios from "axios";
import { startAutoLogoutTimer, clearAutoLogoutTimer } from "../utils/autoLogout";

// === CẤU HÌNH MOCK MODE ===
const MOCK_MODE = false; // Đổi thành false nếu muốn dùng backend thật

const API_URL = "http://localhost:5000/api/auth";

// Dữ liệu giả lập cho 3 role
const mockUsers = {
  school: {
    user: {
      userId: 1,
      hoTen: "Quản trị viên Trường",
      email: "school@demo.com",
      role: "school"
    },
    token: "mock-jwt-token-school-123456"
  },
  parent: {
    user: {
      userId: 2,
      hoTen: "Phụ huynh Nguyễn Văn A",
      email: "parent@demo.com",
      role: "parent"
    },
    token: "mock-jwt-token-parent-123456"
  },
  driver: {
    user: {
      userId: 3,
      hoTen: "Tài xế Trần Văn Nam",
      email: "driver@demo.com",
      role: "driver"
    },
    token: "mock-jwt-token-driver-123456"
  }
};

// Thêm token vào header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý 401 → logout
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      clearAutoLogoutTimer();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  // ĐĂNG NHẬP
  login: async (email, password) => {
    if (!MOCK_MODE) {
      // DÙNG BACKEND THẬT
      const response = await axios.post(`http://localhost:5000/api/auth/login`, { email, password });
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("justLoggedIn", "true");
        startAutoLogoutTimer();
      }
      return response.data;
    }

    // === MOCK MODE: GIẢ LẬP ĐĂNG NHẬP ===
    await new Promise(resolve => setTimeout(resolve, 800)); // Giả lập delay

    let mockUser = null;

    // Xác định role theo email
    if (email.includes("school")) mockUser = mockUsers.school;
    else if (email.includes("parent")) mockUser = mockUsers.parent;
    else if (email.includes("driver")) mockUser = mockUsers.driver;

    if (!mockUser) {
      return {
        success: false,
        message: "Email không hợp lệ. Dùng: school@demo.com, parent@demo.com, driver@demo.com"
      };
    }

    // Lưu vào localStorage
    localStorage.setItem("token", mockUser.token);
    localStorage.setItem("user", JSON.stringify(mockUser.user));
    localStorage.setItem("justLoggedIn", "true");

    // Bắt đầu timer tự động logout
    startAutoLogoutTimer();

    return {
      success: true,
      data: {
        token: mockUser.token,
        user: mockUser.user
      }
    };
  },

  // ĐĂNG XUẤT
  logout: async () => {
    if (!MOCK_MODE) {
      try {
        await axios.post(`http://localhost:5000/api/auth/logout`);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    // Xóa dữ liệu
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("justLoggedIn");
    clearAutoLogoutTimer();

    // Chuyển về login
    window.location.href = "/login";
  },

  // LẤY USER HIỆN TẠI
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // LẤY TOKEN
  getToken: () => {
    return localStorage.getItem("token");
  },

  // KIỂM TRA ĐÃ ĐĂNG NHẬP
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // KIỂM TRA ROLE
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  // KIỂM TRA CÓ MỘT TRONG CÁC ROLE
  hasAnyRole: (roles) => {
    const user = authService.getCurrentUser();
    return roles.includes(user?.role);
  },

  // GIẢ LẬP LẤY USER TỪ SERVER
  fetchCurrentUser: async () => {
    if (!MOCK_MODE) {
      const response = await axios.get(`http://localhost:5000/api/auth/me`);
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      }
    }
    return authService.getCurrentUser();
  }
};

export default authService;