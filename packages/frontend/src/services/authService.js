// frontend/src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Cấu hình axios interceptor để tự động thêm token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý khi token hết hạn
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Chỉ redirect nếu không phải trang login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Đăng nhập
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Lấy thông tin user từ server
  fetchCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/me`);
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    }
    return null;
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Kiểm tra đã đăng nhập
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Kiểm tra role
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  // Kiểm tra có một trong các role
  hasAnyRole: (roles) => {
    const user = authService.getCurrentUser();
    return roles.includes(user?.role);
  }
};

export default authService;