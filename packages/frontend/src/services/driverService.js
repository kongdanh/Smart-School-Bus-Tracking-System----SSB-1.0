// frontend/src/services/driverService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/driver`,
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

const driverService = {
    // Lấy tất cả tài xế
    getAllDrivers: async () => {
        try {
            const response = await axiosInstance.get("/");
            return response.data;
        } catch (error) {
            console.error("Get all drivers error:", error);
            throw error;
        }
    },

    // Lấy tài xế theo ID
    getDriverById: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Get driver by ID error:", error);
            throw error;
        }
    },

    // Thêm tài xế mới
    createDriver: async (driverData) => {
        try {
            const response = await axiosInstance.post("/", driverData);
            return response.data;
        } catch (error) {
            console.error("Create driver error:", error);
            throw error;
        }
    },

    // Cập nhật tài xế
    updateDriver: async (id, driverData) => {
        try {
            const response = await axiosInstance.put(`/${id}`, driverData);
            return response.data;
        } catch (error) {
            console.error("Update driver error:", error);
            throw error;
        }
    },

    // Xóa tài xế
    deleteDriver: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Delete driver error:", error);
            throw error;
        }
    },

    // Lấy lịch trình của tài xế
    getDriverSchedule: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}/schedules`);
            return response.data;
        } catch (error) {
            console.error("Get driver schedule error:", error);
            throw error;
        }
    }
};

export default driverService;