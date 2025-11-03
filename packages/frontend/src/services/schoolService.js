// frontend/src/services/schoolService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/school";

// Axios sẽ tự động thêm token từ authService interceptor

const schoolService = {
  // ==================== DASHBOARD ====================
  getDashboard: async () => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  },

  // ==================== HỌC SINH ====================
  getAllStudents: async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await axios.get(`${API_URL}/students/${id}`);
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await axios.post(`${API_URL}/students`, studentData);
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await axios.put(`${API_URL}/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await axios.delete(`${API_URL}/students/${id}`);
    return response.data;
  },

  // ==================== TÀI XẾ ====================
  getAllDrivers: async () => {
    const response = await axios.get(`${API_URL}/drivers`);
    return response.data;
  },

  getDriverById: async (id) => {
    const response = await axios.get(`${API_URL}/drivers/${id}`);
    return response.data;
  },

  // ==================== XE BUÝT ====================
  getAllBuses: async () => {
    const response = await axios.get(`${API_URL}/buses`);
    return response.data;
  },

  getBusById: async (id) => {
    const response = await axios.get(`${API_URL}/buses/${id}`);
    return response.data;
  },

  createBus: async (busData) => {
    const response = await axios.post(`${API_URL}/buses`, busData);
    return response.data;
  },

  updateBus: async (id, busData) => {
    const response = await axios.put(`${API_URL}/buses/${id}`, busData);
    return response.data;
  },

  deleteBus: async (id) => {
    const response = await axios.delete(`${API_URL}/buses/${id}`);
    return response.data;
  },

  // ==================== TUYẾN ĐƯỜNG ====================
  getAllRoutes: async () => {
    const response = await axios.get(`${API_URL}/routes`);
    return response.data;
  },

  // ==================== LỊCH TRÌNH ====================
  getAllSchedules: async () => {
    const response = await axios.get(`${API_URL}/schedules`);
    return response.data;
  },

  // ==================== TRACKING ====================
  getAllBusLocations: async () => {
    const response = await axios.get(`${API_URL}/tracking`);
    return response.data;
  }
};

export default schoolService;