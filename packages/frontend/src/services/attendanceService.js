// frontend/services/attendanceService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const attendanceService = {
    // Lấy danh sách học sinh theo lịch trình
    getStudentsBySchedule: async (lichTrinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/attendance/schedule/${lichTrinhId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting students by schedule:', error);
            throw error.response?.data || error;
        }
    },

    // Điểm danh đón học sinh
    markPickup: async (lichTrinhId, hocSinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/attendance/pickup`,
                { lichTrinhId, hocSinhId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error marking pickup:', error);
            throw error.response?.data || error;
        }
    },

    // Điểm danh trả học sinh
    markDropoff: async (lichTrinhId, hocSinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/attendance/dropoff`,
                { lichTrinhId, hocSinhId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error marking dropoff:', error);
            throw error.response?.data || error;
        }
    },

    // Hủy điểm danh đón
    unmarkPickup: async (lichTrinhId, hocSinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/attendance/unpickup`,
                { lichTrinhId, hocSinhId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error unmarking pickup:', error);
            throw error.response?.data || error;
        }
    },

    // Hủy điểm danh trả
    unmarkDropoff: async (lichTrinhId, hocSinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/attendance/undropoff`,
                { lichTrinhId, hocSinhId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error unmarking dropoff:', error);
            throw error.response?.data || error;
        }
    },

    // Thêm ghi chú
    addNote: async (lichTrinhId, hocSinhId, ghiChu) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/attendance/note`,
                { lichTrinhId, hocSinhId, ghiChu },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding note:', error);
            throw error.response?.data || error;
        }
    },

    // Điểm danh tất cả
    markAllPickup: async (lichTrinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/attendance/pickup-all`,
                { lichTrinhId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error marking all pickup:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy báo cáo điểm danh
    getAttendanceReport: async (lichTrinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/attendance/report/${lichTrinhId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting attendance report:', error);
            throw error.response?.data || error;
        }
    },

    // Upload ảnh chứng nhận (nếu cần)
    uploadPhoto: async (lichTrinhId, hocSinhId, photo) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('photo', photo);
            formData.append('lichTrinhId', lichTrinhId);
            formData.append('hocSinhId', hocSinhId);

            const response = await axios.post(
                `${API_URL}/attendance/upload-photo`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error uploading photo:', error);
            throw error.response?.data || error;
        }
    }
};

export default attendanceService;