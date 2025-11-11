// frontend/src/services/routeService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/route`,
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

const routeService = {
    // Lấy tất cả tuyến đường
    getAllRoutes: async () => {
        try {
            const response = await axiosInstance.get("/");
            return response.data;
        } catch (error) {
            console.error("Get all routes error:", error);
            throw error;
        }
    },

    // Lấy tuyến đường theo ID
    getRouteById: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Get route by ID error:", error);
            throw error;
        }
    },

    // Thêm tuyến đường mới
    createRoute: async (routeData) => {
        try {
            const response = await axiosInstance.post("/", routeData);
            return response.data;
        } catch (error) {
            console.error("Create route error:", error);
            throw error;
        }
    },

    // Cập nhật tuyến đường
    updateRoute: async (id, routeData) => {
        try {
            const response = await axiosInstance.put(`/${id}`, routeData);
            return response.data;
        } catch (error) {
            console.error("Update route error:", error);
            throw error;
        }
    },

    // Xóa tuyến đường
    deleteRoute: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Delete route error:", error);
            throw error;
        }
    },

    // Lấy các điểm dừng của tuyến
    getRouteStops: async (routeId) => {
        try {
            const response = await axiosInstance.get(`/${routeId}/stops`);
            return response.data;
        } catch (error) {
            console.error("Get route stops error:", error);
            throw error;
        }
    },

    // Thêm điểm dừng vào tuyến
    addStopToRoute: async (routeId, stopData) => {
        try {
            const response = await axiosInstance.post(`/${routeId}/stops`, stopData);
            return response.data;
        } catch (error) {
            console.error("Add stop to route error:", error);
            throw error;
        }
    },

    // Xóa điểm dừng khỏi tuyến
    removeStopFromRoute: async (routeId, stopId) => {
        try {
            const response = await axiosInstance.delete(`/${routeId}/stops/${stopId}`);
            return response.data;
        } catch (error) {
            console.error("Remove stop from route error:", error);
            throw error;
        }
    }
};

export default routeService;