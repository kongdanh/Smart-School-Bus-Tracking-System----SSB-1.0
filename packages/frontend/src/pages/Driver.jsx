import React, { useState, useEffect } from "react"; // Thêm useEffect
import { useNavigate } from "react-router-dom";
import "../style/Driver.css";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Driver() {
  const navigate = useNavigate();

  // State để lưu thông tin tuyến đường lấy từ API
  const [currentRoute, setCurrentRoute] = useState("Đang tải tuyến đường...");

  // useEffect sẽ chạy một lần sau khi component được render
  useEffect(() => {
    // Định nghĩa một hàm async để gọi API
    const fetchCurrentRoute = async () => {
      try {
        // Gọi đến một API mới tên là /api/route/current
        const response = await fetch(`${API_URL}/api/testapi`);
        if (!response.ok) {
          throw new Error("Lỗi mạng hoặc server");
        }
        const data = await response.json();

        // Cập nhật state với tên tuyến đường từ API
        setCurrentRoute(data.message);

      } catch (error) {
        console.error("Không thể lấy thông tin tuyến đường:", error);
        setCurrentRoute("Không thể tải tuyến đường");
      }
    };

    // Gọi hàm vừa định nghĩa
    fetchCurrentRoute();
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="driver-container">
      <header className="driver-header">
        <h1>🚌 Smart School Bus Tracking</h1>
        <p>Trang dành cho <strong>Tài Xế</strong></p>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </header>

      <main className="driver-main">
        <div className="driver-card">
          <h2>🚦 Bảng điều khiển tài xế</h2>
          <ul>
            {/* Hiển thị thông tin tuyến đường từ state */}
            <li>📍 Xem tuyến đường hiện tại: <strong>{currentRoute}</strong></li>
            <li>👧 Danh sách học sinh trên xe</li>
            <li>✅ Xác nhận điểm đón và trả</li>
          </ul>
          <button className="driver-btn">Bắt đầu chuyến đi</button>
        </div>
      </main>

      <footer className="driver-footer">
        <p>© 2025 Smart School Bus Tracking System</p>
      </footer>
    </div>
  );
}