import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const parentService = {
    // Lấy danh sách con
    getMyChildren: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/parent/children`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Lấy vị trí xe
    getBusLocation: async (hocSinhId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/parent/tracking/${hocSinhId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default parentService;