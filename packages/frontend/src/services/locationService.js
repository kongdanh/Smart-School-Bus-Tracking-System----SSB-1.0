import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
    baseURL: `${API_URL}/location`,
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

const locationService = {
    // --- HÀM QUAN TRỌNG ĐỂ SỬA LỖI BUS STATUS ---
    getCurrentLocation: () => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn("Trình duyệt không hỗ trợ Geolocation");
                return resolve({ success: false, message: "Không hỗ trợ GPS" });
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        success: true,
                        data: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            speed: position.coords.speed ? (position.coords.speed * 3.6).toFixed(1) : 0
                        }
                    });
                },
                (error) => {
                    console.error("Lỗi lấy vị trí:", error);
                    // Trả về success false để không crash app
                    resolve({ success: false, error: error.message });
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    },

    // Lấy vị trí tất cả xe buýt
    getAllBusLocations: async () => {
        try {
            const response = await axiosInstance.get("/buses");
            return response.data;
        } catch (error) {
            console.error("Get all bus locations error:", error);
            throw error;
        }
    },

    // Lấy vị trí xe buýt theo ID
    getBusLocationById: async (busId) => {
        try {
            const response = await axiosInstance.get(`/buses/${busId}`);
            return response.data;
        } catch (error) {
            // Nếu 404 (chưa có vị trí), trả về null thay vì throw lỗi
            if (error.response && error.response.status === 404) {
                return { success: true, data: null };
            }
            console.error("Get bus location by ID error:", error);
            throw error;
        }
    },

    // Cập nhật vị trí xe (dành cho tài xế)
    updateBusLocation: async (busId, locationData) => {
        try {
            const response = await axiosInstance.post(`/buses/${busId}`, locationData);
            return response.data;
        } catch (error) {
            console.error("Update bus location error:", error);
            throw error;
        }
    },

    // Lấy lịch sử vị trí xe
    getBusLocationHistory: async (busId, startDate, endDate) => {
        try {
            const response = await axiosInstance.get(`/buses/${busId}/history`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error("Get bus location history error:", error);
            throw error;
        }
    },

    // Theo dõi vị trí real-time (Polling)
    subscribeToLocationUpdates: (busId, callback) => {
        const interval = setInterval(async () => {
            try {
                const result = await locationService.getBusLocationById(busId);
                callback(result.data);
            } catch (error) {
                console.error("Location update error:", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }
};

export default locationService;