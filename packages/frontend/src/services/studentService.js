// frontend/src/services/studentService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/student`,
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

const studentService = {
    // Lấy tất cả học sinh
    getAllStudents: async () => {
        try {
            const response = await axiosInstance.get("/");
            return response.data;
        } catch (error) {
            console.error("Get all students error:", error);
            throw error;
        }
    },

    // Lấy học sinh theo ID
    getStudentById: async (id) => {
        try {
            const response = await axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Get student by ID error:", error);
            throw error;
        }
    },

    // Thêm học sinh mới
    createStudent: async (studentData) => {
        try {
            const response = await axiosInstance.post("/", studentData);
            return response.data;
        } catch (error) {
            console.error("Create student error:", error);
            throw error;
        }
    },

    // Cập nhật học sinh
    updateStudent: async (id, studentData) => {
        try {
            const response = await axiosInstance.put(`/${id}`, studentData);
            return response.data;
        } catch (error) {
            console.error("Update student error:", error);
            throw error;
        }
    },

    // Xóa học sinh
    deleteStudent: async (id) => {
        try {
            const response = await axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Delete student error:", error);
            throw error;
        }
    },

    // Lấy học sinh theo phụ huynh
    getStudentsByParent: async (parentId) => {
        try {
            const response = await axiosInstance.get(`/parent/${parentId}`);
            return response.data;
        } catch (error) {
            console.error("Get students by parent error:", error);
            throw error;
        }
    }
};

export default studentService;