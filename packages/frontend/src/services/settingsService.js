// frontend/services/settingsService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const settingsService = {
    // Lấy cài đặt người dùng
    getUserSettings: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/settings`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting user settings:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật cài đặt thông báo
    updateNotificationSettings: async (settings) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/settings/notifications`,
                settings,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating notification settings:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật theme
    updateTheme: async (thoiBieu) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/settings/theme`,
                { thoiBieu },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating theme:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật ngôn ngữ
    updateLanguage: async (ngonNgu) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/settings/language`,
                { ngonNgu },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating language:', error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật thông tin cá nhân
    updateProfile: async (profileData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/settings/profile`,
                profileData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error.response?.data || error;
        }
    },

    // Đổi mật khẩu
    changePassword: async (currentPassword, newPassword) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/settings/password`,
                { currentPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error.response?.data || error;
        }
    },

    // Upload avatar
    uploadAvatar: async (file) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axios.post(
                `${API_URL}/settings/avatar`,
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
            console.error('Error uploading avatar:', error);
            throw error.response?.data || error;
        }
    },

    // Xóa avatar
    deleteAvatar: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${API_URL}/settings/avatar`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting avatar:', error);
            throw error.response?.data || error;
        }
    }
};

export default settingsService;