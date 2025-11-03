// frontend/src/pages/SchoolDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import schoolService from "../services/schoolService";
import authService from "../services/authService";
import "../style/SchoolDashboard.css";

export default function SchoolDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeBuses: 0,
    totalBuses: 0,
    onTimeDrivers: 0,
    totalDrivers: 0,
    routes: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch dashboard data khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getDashboard();

      if (response.success) {
        const { statistics, recentActivities } = response.data;

        setStats({
          totalStudents: statistics.totalStudents || 0,
          activeBuses: statistics.activeBuses || 0,
          totalBuses: statistics.totalBuses || 0,
          onTimeDrivers: statistics.onTimeDrivers || 0,
          totalDrivers: statistics.totalDrivers || 0,
          routes: statistics.routes || 0
        });

        setRecentActivities(recentActivities || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      // Nếu lỗi 401 (token hết hạn), redirect về login
      if (error.response?.status === 401) {
        authService.logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

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
            🚪 Đăng xuất
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
          {recentActivities.length > 0 ? (
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
          ) : (
            <div className="no-activities">
              <p>Chưa có hoạt động nào gần đây</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}