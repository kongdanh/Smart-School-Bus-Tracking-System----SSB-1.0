import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SchoolDashboard.css";

export default function SchoolDashboard() {
  const navigate = useNavigate();
  const [stats] = useState({
    totalStudents: 1247,
    activeBuses: 12,
    totalBuses: 15,
    onTimeDrivers: 18,
    totalDrivers: 20,
    routes: 8
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: "success",
      message: "Xe buýt 29B-12345 đã hoàn thành tuyến A1",
      time: "2 phút trước",
      icon: "✅"
    },
    {
      id: 2,
      type: "warning",
      message: "Tài xế Nguyễn Văn A đã bắt đầu tuyến B2",
      time: "5 phút trước",
      icon: "📍"
    },
    {
      id: 3,
      type: "alert",
      message: "Xe buýt 29B-67890 báo cáo chậm 10 phút do kẹt xe",
      time: "8 phút trước",
      icon: "⚠️"
    }
  ]);

  const handleLogout = () => {
    // Xóa JWT token khỏi localStorage
    localStorage.removeItem("token");

    // (Tùy chọn) Xóa thêm các thông tin khác nếu bạn có lưu, ví dụ:
    // localStorage.removeItem("user");

    // Chuyển hướng về trang đăng nhập
    navigate("/");
  };


  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="school-dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🏫</span>
            <div className="logo-text">
              <h1>Smart School Bus Tracking</h1>
              <p>Trang dành cho Nhà Trường</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button className="nav-item active" onClick={() => handleNavigation('/school/dashboard')}>
          📊 Tổng quan
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/students')}>
          👥 Học sinh
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/drivers')}>
          🚗 Tài xế
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/buses')}>
          🚌 Xe buýt
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/routes')}>
          🗺️ Tuyến đường
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/tracking')}>
          📍 Theo dõi
        </button>
        <button className="nav-item notification" onClick={() => handleNavigation('/school/notifications')}>
          🔔 Tin nhắn <span className="badge">5</span>
        </button>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-title">
          <h2>📊 Tổng quan hệ thống</h2>
          <p>Thống kê tổng quan về hoạt động xe buýt trường học</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card students">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-label">Tổng học sinh</div>
              <div className="stat-value">{stats.totalStudents.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-card buses">
            <div className="stat-icon">🚌</div>
            <div className="stat-content">
              <div className="stat-label">Xe đang hoạt động</div>
              <div className="stat-value">{stats.activeBuses}/{stats.totalBuses}</div>
            </div>
          </div>

          <div className="stat-card drivers">
            <div className="stat-icon">👨‍✈️</div>
            <div className="stat-content">
              <div className="stat-label">Tài xế trực</div>
              <div className="stat-value">{stats.onTimeDrivers}/{stats.totalDrivers}</div>
            </div>
          </div>

          <div className="stat-card routes">
            <div className="stat-icon">🗺️</div>
            <div className="stat-content">
              <div className="stat-label">Tuyến đường</div>
              <div className="stat-value">{stats.routes}</div>
            </div>
          </div>
        </div>

        <div className="activities-section">
          <h3>🕐 Hoạt động gần đây</h3>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}