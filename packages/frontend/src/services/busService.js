// frontend/src/services/busService.js
import axios from 'axios';

// ✅ Sửa: Dùng import.meta.env cho Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: `${API_URL}/bus`,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor
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

// Response interceptor
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

const busService = {
    // Lấy xe của tài xế hiện tại
    getMyBus: async () => {
        try {
            const response = await axiosInstance.get('/my-bus');
            return response.data;
        } catch (error) {
            console.error('Error getting my bus:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy danh sách tất cả xe (School Admin)
    getAllBuses: async (page = 1, limit = 10, search = '') => {
        try {
            const response = await axiosInstance.get('/', {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting all buses:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy chi tiết xe
    getBusDetail: async (xeBuytId) => {
        try {
            const response = await axiosInstance.get(`/${xeBuytId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting bus detail:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy vị trí xe
    getBusLocation: async (xeBuytId) => {
        try {
            const response = await axiosInstance.get(`/${xeBuytId}/location`);
            return response.data;
        } catch (error) {
            console.error('Error getting bus location:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật vị trí xe (Driver)
    updateBusLocation: async (xeBuytId, vido, kinhdo) => {
        try {
            const response = await axiosInstance.post('/location', {
                xeBuytId,
                vido,
                kinhdo
            });
            return response.data;
        } catch (error) {
            console.error('Error updating bus location:', error);
            throw error.response?.data || error;
        }
    },

    // Tạo xe mới (School Admin)
    createBus: async (busData) => {
        try {
            const response = await axiosInstance.post('/', busData);
            return response.data;
        } catch (error) {
            console.error('Error creating bus:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật thông tin xe (School Admin)
    updateBus: async (xeBuytId, busData) => {
        try {
            const response = await axiosInstance.put(`/${xeBuytId}`, busData);
            return response.data;
        } catch (error) {
            console.error('Error updating bus:', error);
            throw error.response?.data || error;
        }
    },

    // Xóa xe (School Admin)
    deleteBus: async (xeBuytId) => {
        try {
            const response = await axiosInstance.delete(`/${xeBuytId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting bus:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy thống kê xe (School Admin)
    getBusStats: async () => {
        try {
            const response = await axiosInstance.get('/stats');
            return response.data;
        } catch (error) {
            console.error('Error getting bus stats:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy học sinh trên xe
    getBusStudents: async (xeBuytId) => {
        try {
            const response = await axiosInstance.get(`/${xeBuytId}/students`);
            return response.data;
        } catch (error) {
            console.error('Error getting bus students:', error);
            throw error.response?.data || error;
        }
    }
};

export default busService;