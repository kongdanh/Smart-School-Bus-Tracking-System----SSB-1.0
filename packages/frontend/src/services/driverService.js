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
    // Lấy hồ sơ của tài xế đang đăng nhập
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/profile');
            return response.data;
        } catch (error) {
            console.error('Error getting driver profile:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật hồ sơ tài xế
    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.put('/profile', profileData);
            return response.data;
        } catch (error) {
            console.error('Error updating driver profile:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy tất cả tài xế
    getAllDrivers: async () => {
        try {
            const response = await axiosInstance.get('/all');
            return response.data;
        } catch (error) {
            console.error('Error getting all drivers:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy tài xế theo ID
    getDriverById: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting driver by ID:', error);
            throw error.response?.data || error;
        }
    },

    // Tạo tài xế mới
    createDriver: async (driverData) => {
        try {
            const response = await axiosInstance.post('/', driverData);
            return response.data;
        } catch (error) {
            console.error('Error creating driver:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật tài xế
    updateDriver: async (id, driverData) => {
        try {
            const response = await axiosInstance.put(`/${id}`, driverData);
            return response.data;
        } catch (error) {
            console.error('Error updating driver:', error);
            throw error.response?.data || error;
        }
    },

    // Xóa tài xế
    deleteDriver: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting driver:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy lịch trình của tài xế
    getDriverSchedule: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}/schedule`);
            return response.data;
        } catch (error) {
            console.error('Error getting driver schedule:', error);
            throw error.response?.data || error;
        }
    },

    // Dashboard (MOCK - giữ để tương thích)
    getDashboard: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            success: true,
            data: {
                statistics: {
                    studentsToday: 28,
                    completedTrips: 1,
                    totalTrips: 2,
                    attendance: 96,
                    routeDistance: "42.5 km"
                },
                schedule: [
                    {
                        id: 1,
                        time: "06:30",
                        routeName: "Tuyến A1 - Quận 7 → Trường XYZ",
                        studentCount: 15,
                        stops: 8,
                        status: "completed"
                    },
                    {
                        id: 2,
                        time: "07:15",
                        routeName: "Tuyến A2 - Quận 7 → Trường XYZ",
                        studentCount: 13,
                        stops: 7,
                        status: "pending"
                    }
                ],
                checkInStatus: true,
                currentTrip: {
                    id: 2,
                    routeName: "Tuyến A2 - Quận 7 → Trường XYZ"
                }
            }
        };
    },

    checkIn: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { success: true };
    },

    checkOut: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { success: true };
    }
};

export default driverService;