import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/School.css";

export default function School() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="school-container">
      <header className="school-header">
        <h1>🏫 Smart School Bus Tracking</h1>
        <p>Trang dành cho <strong>Nhà Trường</strong></p>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </header>

      <main className="school-main">
        <div className="school-card">
          <h2>📋 Quản lý xe và học sinh</h2>
          <ul>
            <li>Xem danh sách xe hoạt động</li>
            <li>Quản lý tài xế và tuyến đường</li>
            <li>Theo dõi thời gian thực</li>
          </ul>
        </div>
      </main>

      <footer className="school-footer">
        <p>© 2025 Smart School Bus Tracking System</p>
      </footer>
    </div>
  );
}
