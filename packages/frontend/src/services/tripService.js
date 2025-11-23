// frontend/services/tripService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const tripService = {
    // Bắt đầu chuyến xe
    startTrip: async (lichTrinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/trip/start`,
                { lichTrinhId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error starting trip:', error);
            throw error.response?.data || error;
        }
    },

    // Kết thúc chuyến xe
    endTrip: async (tripRecordId, soKmDiDuoc) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/trip/end`,
                { tripRecordId, soKmDiDuoc },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error ending trip:', error);
            throw error.response?.data || error;
        }
    },

    // Báo cáo sự cố
    reportIncident: async (tripRecordId, moTaSuCo) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/trip/incident`,
                { tripRecordId, moTaSuCo },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error reporting incident:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật số km đã đi
    updateDistance: async (tripRecordId, soKmDiDuoc) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/trip/distance`,
                { tripRecordId, soKmDiDuoc },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating distance:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy chuyến xe hiện tại
    getCurrentTrip: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/trip/current`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting current trip:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy lịch sử chuyến xe
    getTripHistory: async (page = 1, limit = 10) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/trip/history`,
                {
                    params: { page, limit },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting trip history:', error);
            throw error.response?.data || error;
        }
    },

    // Lấy chi tiết chuyến xe
    getTripDetail: async (tripRecordId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/trip/${tripRecordId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting trip detail:', error);
            throw error.response?.data || error;
        }
    }
};

export default tripService;