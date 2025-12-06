// frontend/src/services/scheduleService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/schedule`,
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

const scheduleService = {
    // Lấy tất cả lịch trình
    getAllSchedules: async () => {
        try {
            const response = await axiosInstance.get("/");
            return response.data;
        } catch (error) {
            console.error("Get all schedules error:", error);
            throw error;
        }
    },

    // Lấy lịch trình theo ID
    getScheduleById: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Get schedule by ID error:", error);
            throw error;
        }
    },

    // Thêm lịch trình mới
    createSchedule: async (scheduleData) => {
        try {
            console.log('=== ScheduleService.createSchedule ===');
            console.log('Request data:', scheduleData);
            console.log('API URL:', `${API_URL}/schedule`);

            const response = await axiosInstance.post("/", scheduleData);
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error("=== ScheduleService.createSchedule Error ===");
            console.error("Error details:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error config:", error.config);
            throw error;
        }
    },

    // Cập nhật lịch trình
    updateSchedule: async (id, scheduleData) => {
        try {
            const response = await axiosInstance.put(`/${id}`, scheduleData);
            return response.data;
        } catch (error) {
            console.error("Update schedule error:", error);
            throw error;
        }
    },

    // Xóa lịch trình
    deleteSchedule: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Delete schedule error:", error);
            throw error;
        }
    },

    // Lấy lịch trình theo ngày
    getSchedulesByDate: async (date) => {
        try {
            const response = await axiosInstance.get("/date", {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error("Get schedules by date error:", error);
            throw error;
        }
    },

    // Lấy lịch trình của tài xế
    getDriverSchedules: async (driverId) => {
        try {
            const response = await axiosInstance.get(`/driver/${driverId}`);
            return response.data;
        } catch (error) {
            console.error("Get driver schedules error:", error);
            throw error;
        }
    },

    // Lấy lịch trình của xe buýt
    getBusSchedules: async (busId) => {
        try {
            const response = await axiosInstance.get(`/bus/${busId}`);
            return response.data;
        } catch (error) {
            console.error("Get bus schedules error:", error);
            throw error;
        }
    }
};

export default scheduleService;