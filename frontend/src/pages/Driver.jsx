import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Driver.css";

export default function Driver() {
  const navigate = useNavigate();

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
            <li>📍 Xem tuyến đường hiện tại</li>
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
