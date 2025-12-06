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

    // Lấy lịch trình của tài xế theo ID
    getDriverSchedule: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}/schedule`);
            return response.data;
        } catch (error) {
            console.error('Error getting driver schedule:', error);
            throw error.response?.data || error;
        }
    },

    // Dashboard - Lấy dữ liệu thực từ API
    getDashboard: async () => {
        try {
            // Lấy profile của tài xế đang đăng nhập
            const profileRes = await axiosInstance.get('/profile');
            if (!profileRes.data || !profileRes.data.success) {
                throw new Error('Không thể lấy thông tin tài xế');
            }

            const driver = profileRes.data.data;

            // Lấy lịch trình hôm nay của tài xế đang đăng nhập
            const scheduleRes = await axiosInstance.get('/schedule/today');
            const todaySchedules = scheduleRes.data.data || [];

            // Tìm lịch trình đang chạy (có status = 'in_progress')
            const currentTrip = todaySchedules.find(s => s.trangThai === 'in_progress');

            // Tính toán stats
            const completedToday = todaySchedules.filter(s => s.trangThai === 'completed').length;
            const totalTrips = todaySchedules.length;

            // Lấy số học sinh từ studentTrips array
            const studentCount = currentTrip?.studentTrips?.length || 0;

            return {
                success: true,
                data: {
                    stats: {
                        totalTrips: totalTrips,
                        completedToday: completedToday,
                        studentsOnBoard: studentCount,
                        rating: driver.gioHeBay || 0
                    },
                    currentTrip: currentTrip ? {
                        id: currentTrip.lichTrinhId,
                        routeName: currentTrip.tuyenduong?.tenTuyen || 'N/A',
                        busNumber: currentTrip.xebuyt?.bienSoXe || 'N/A',
                        startTime: currentTrip.gioKhoiHanh,
                        currentStop: `Stop 1 of ${currentTrip.tuyenduong?.tuyenduong_diemdung?.length || 0}`,
                        studentsCount: studentCount
                    } : null,
                    checkedIn: !!currentTrip,
                    schedules: todaySchedules
                }
            };
        } catch (error) {
            console.error('Error getting dashboard:', error);
            // Fallback to empty data nếu API lỗi
            return {
                success: false,
                data: {
                    stats: {
                        totalTrips: 0,
                        completedToday: 0,
                        studentsOnBoard: 0,
                        rating: 0
                    },
                    currentTrip: null,
                    checkedIn: false,
                    schedules: []
                }
            };
        }
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