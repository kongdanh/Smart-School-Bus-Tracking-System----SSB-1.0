import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Parent.css";

export default function Parent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa JWT token khỏi localStorage
    localStorage.removeItem("token");

    // (Tùy chọn) Xóa thêm các thông tin khác nếu bạn có lưu, ví dụ:
    // localStorage.removeItem("user");

    // Chuyển hướng về trang đăng nhập
    navigate("/");
  };


  return (
    <div className="parent-container">
      {/* ✅ Nút đăng xuất tách riêng, không nằm trong header để tránh căn giữa */}
      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>

      <header className="parent-header">
        <h1>👨‍👩‍👧‍👦 Smart School Bus Tracking</h1>
        <p>
          Trang dành cho <strong>Phụ huynh</strong>
        </p>
      </header>

      <main className="parent-main">
        <div className="parent-card">
          <h2>📍 Thông tin xe đưa đón</h2>
          <ul>
            <li>Vị trí xe hiện tại</li>
            <li>Giờ đón & trả học sinh</li>
            <li>Lịch trình hôm nay</li>
          </ul>
          <button className="track-btn" onClick={() => navigate("/parent/map")}>
            Xem chi tiết
          </button>
        </div>
      </main>

      <footer className="parent-footer">
        <p>© 2025 Smart School Bus Tracking System</p>
      </footer>
    </div>
  );
}