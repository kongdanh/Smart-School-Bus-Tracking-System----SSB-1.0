// frontend/src/services/notificationService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/notification`,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const notificationService = {
    // Lấy tất cả thông báo
    getAllNotifications: async () => {
        try {
            const response = await axiosInstance.get("/");
            return response.data;
        } catch (error) {
            console.error("Get all notifications error:", error);
            throw error;
        }
    },

    // Lấy thông báo chưa đọc
    getUnreadNotifications: async () => {
        try {
            const response = await axiosInstance.get("/unread");
            return response.data;
        } catch (error) {
            console.error("Get unread notifications error:", error);
            throw error;
        }
    },

    // Lấy thông báo theo ID
    getNotificationById: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Get notification by ID error:", error);
            throw error;
        }
    },

    // Gửi thông báo mới
    sendNotification: async (notificationData) => {
        try {
            const response = await axiosInstance.post("/", notificationData);
            return response.data;
        } catch (error) {
            console.error("Send notification error:", error);
            throw error;
        }
    },

    // Đánh dấu đã đọc
    markAsRead: async (id) => {
        try {
            const response = await axiosInstance.put(`/${id}/read`);
            return response.data;
        } catch (error) {
            console.error("Mark notification as read error:", error);
            throw error;
        }
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: async () => {
        try {
            const response = await axiosInstance.put("/read-all");
            return response.data;
        } catch (error) {
            console.error("Mark all as read error:", error);
            throw error;
        }
    },

    // Xóa thông báo
    deleteNotification: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Delete notification error:", error);
            throw error;
        }
    },

    // Đếm số thông báo chưa đọc
    getUnreadCount: async () => {
        try {
            const response = await axiosInstance.get("/unread/count");
            return response.data;
        } catch (error) {
            console.error("Get unread count error:", error);
            throw error;
        }
    }
};

export default notificationService;