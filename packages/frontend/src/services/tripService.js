import axios from 'axios';

// Đảm bảo file .env của bạn có biến VITE_API_BASE_URL=http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: `${API_URL}/trip`, // Base URL trỏ vào route trip
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - Tự động thêm Token từ localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Xử lý lỗi 401 (Token hết hạn)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const tripService = {
    // Lấy thông tin Dashboard (Driver info + Bus info + Lịch trình hôm nay)
    // Gọi vào route /current ở backend
    getDriverDashboard: async () => {
        try {
            const response = await axiosInstance.get('/current');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            throw error.response?.data || error;
        }
    },

    // Bắt đầu chuyến xe (Check In)
    startTrip: async (lichTrinhId) => {
        try {
            const response = await axiosInstance.post('/start', { lichTrinhId });
            return response.data;
        } catch (error) {
            console.error('Error starting trip:', error);
            throw error.response?.data || error;
        }
    },

    // Kết thúc chuyến xe (Check Out)
    endTrip: async (tripRecordId, soKmDiDuoc) => {
        try {
            const response = await axiosInstance.post('/end', {
                tripRecordId,
                soKmDiDuoc
            });
            return response.data;
        } catch (error) {
            console.error('Error ending trip:', error);
            throw error.response?.data || error;
        }
    },

    // Báo cáo sự cố
    reportIncident: async (tripRecordId, moTaSuCo) => {
        try {
            const response = await axiosInstance.post('/incident', {
                tripRecordId,
                moTaSuCo
            });
            return response.data;
        } catch (error) {
            console.error('Error reporting incident:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy lịch sử chuyến xe
    getTripHistory: async (page = 1, limit = 10) => {
        try {
            const response = await axiosInstance.get('/history', {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting trip history:', error);
            throw error.response?.data || error;
        }
    }
};

export default tripService;