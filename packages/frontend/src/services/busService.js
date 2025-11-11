// frontend/src/services/busService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/bus`,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Thêm token
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

const busService = {
    // Lấy tất cả xe buýt
    getAllBuses: async () => {
        try {
            const response = await axiosInstance.get("/");
            return response.data;
        } catch (error) {
            console.error("Get all buses error:", error);
            throw error;
        }
    },

    // Lấy xe buýt theo ID
    getBusById: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Get bus by ID error:", error);
            throw error;
        }
    },

    // Thêm xe buýt mới
    createBus: async (busData) => {
        try {
            const response = await axiosInstance.post("/", busData);
            return response.data;
        } catch (error) {
            console.error("Create bus error:", error);
            throw error;
        }
    },

    // Cập nhật xe buýt
    updateBus: async (id, busData) => {
        try {
            const response = await axiosInstance.put(`/${id}`, busData);
            return response.data;
        } catch (error) {
            console.error("Update bus error:", error);
            throw error;
        }
    },

    // Xóa xe buýt
    deleteBus: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Delete bus error:", error);
            throw error;
        }
    },

    // Lấy vị trí hiện tại của xe
    getBusLocation: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}/location`);
            return response.data;
        } catch (error) {
            console.error("Get bus location error:", error);
            throw error;
        }
    }
};

export default busService;