// frontend/src/services/parentService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/parent`,
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

const parentService = {
    // Lấy thông tin phụ huynh hiện tại
    getCurrentParent: async () => {
        try {
            const response = await axiosInstance.get("/me");
            return response.data;
        } catch (error) {
            console.error("Get current parent error:", error);
            throw error;
        }
    },

    // Lấy danh sách con của phụ huynh
    getMyChildren: async () => {
        try {
            const response = await axiosInstance.get("/children");
            return response.data;
        } catch (error) {
            console.error("Get my children error:", error);
            throw error;
        }
    },

    // Lấy vị trí xe của con
    getChildBusLocation: async (studentId) => {
        try {
            const response = await axiosInstance.get(`/children/${studentId}/bus-location`);
            return response.data;
        } catch (error) {
            console.error("Get child bus location error:", error);
            throw error;
        }
    },

    // Lấy lịch trình xe đưa đón
    getChildSchedule: async (studentId) => {
        try {
            const response = await axiosInstance.get(`/children/${studentId}/schedule`);
            return response.data;
        } catch (error) {
            console.error("Get child schedule error:", error);
            throw error;
        }
    },

    // Lấy thông báo
    getNotifications: async () => {
        try {
            const response = await axiosInstance.get("/notifications");
            return response.data;
        } catch (error) {
            console.error("Get notifications error:", error);
            throw error;
        }
    },

    // Đánh dấu đã đọc thông báo
    markNotificationAsRead: async (notificationId) => {
        try {
            const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            console.error("Mark notification as read error:", error);
            throw error;
        }
    }
};

export default parentService;