// frontend/src/services/locationService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/location`,
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

const locationService = {
    // Lấy vị trí tất cả xe buýt
    getAllBusLocations: async () => {
        try {
            const response = await axiosInstance.get("/buses");
            return response.data;
        } catch (error) {
            console.error("Get all bus locations error:", error);
            throw error;
        }
    },

    // Lấy vị trí xe buýt theo ID
    getBusLocationById: async (busId) => {
        try {
            const response = await axiosInstance.get(`/buses/${busId}`);
            return response.data;
        } catch (error) {
            console.error("Get bus location by ID error:", error);
            throw error;
        }
    },

    // Cập nhật vị trí xe (dành cho tài xế)
    updateBusLocation: async (busId, locationData) => {
        try {
            const response = await axiosInstance.post(`/buses/${busId}`, locationData);
            return response.data;
        } catch (error) {
            console.error("Update bus location error:", error);
            throw error;
        }
    },

    // Lấy lịch sử vị trí xe
    getBusLocationHistory: async (busId, startDate, endDate) => {
        try {
            const response = await axiosInstance.get(`/buses/${busId}/history`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error("Get bus location history error:", error);
            throw error;
        }
    },

    // Theo dõi vị trí real-time (WebSocket hoặc polling)
    subscribeToLocationUpdates: (busId, callback) => {
        // Implement WebSocket hoặc polling
        const interval = setInterval(async () => {
            try {
                const result = await locationService.getBusLocationById(busId);
                callback(result.data);
            } catch (error) {
                console.error("Location update error:", error);
            }
        }, 5000); // Cập nhật mỗi 5 giây

        // Return unsubscribe function
        return () => clearInterval(interval);
    }
};

export default locationService;