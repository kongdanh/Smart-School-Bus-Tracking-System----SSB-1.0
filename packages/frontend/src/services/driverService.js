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
    // Các hàm cũ của bạn giữ nguyên...
    getAllDrivers: async () => { /* ... */ },
    getDriverById: async (id) => { /* ... */ },
    createDriver: async (driverData) => { /* ... */ },
    updateDriver: async (id, driverData) => { /* ... */ },
    deleteDriver: async (id) => { /* ... */ },
    getDriverSchedule: async (id) => { /* ... */ },

    // THÊM MỚI - CHO DASHBOARD HOẠT ĐỘNG NGAY
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