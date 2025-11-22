import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import schoolService from "../../services/schoolService";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import "../../styles/school-styles/school-dashboard.css";

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

  useEffect(() => {
    fetchDashboardData();

    if (localStorage.getItem("justLoggedIn") === "true") {
      localStorage.removeItem("justLoggedIn");
      const user = authService.getCurrentUser();
      const userName = user?.name || user?.email || "Admin";
      toast.success(`Welcome back, ${userName}!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="school-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Monitor your school bus operations in real-time</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchDashboardData}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card students">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{stats.totalStudents.toLocaleString()}</div>
            <div className="stat-change positive">+5.2% from last month</div>
          </div>
        </div>

        <div className="stat-card buses">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Buses</div>
            <div className="stat-value">{stats.activeBuses}/{stats.totalBuses}</div>
            <div className="stat-change neutral">{Math.round((stats.activeBuses / stats.totalBuses) * 100)}% operational</div>
          </div>
        </div>

        <div className="stat-card drivers">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">On-duty Drivers</div>
            <div className="stat-value">{stats.onTimeDrivers}/{stats.totalDrivers}</div>
            <div className="stat-change positive">All drivers checked in</div>
          </div>
        </div>

        <div className="stat-card routes">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="19" r="3" />
              <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
              <circle cx="18" cy="5" r="3" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Routes</div>
            <div className="stat-value">{stats.routes}</div>
            <div className="stat-change neutral">Covering all zones</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Activities Section */}
        <div className="activities-section">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <button className="btn-view-all" onClick={() => handleNavigation('/school/notifications')}>
              View All
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {recentActivities.length > 0 ? (
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">
                    <span>{activity.icon}</span>
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>No recent activities</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>

          <div className="quick-actions-grid">
            <button className="action-card" onClick={() => handleNavigation('/school/students')}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h3>Add Student</h3>
              <p>Register new student</p>
            </button>

            <button className="action-card" onClick={() => handleNavigation('/school/buses')}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3>Manage Buses</h3>
              <p>View all buses</p>
            </button>

            <button className="action-card" onClick={() => handleNavigation('/school/routes')}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <h3>Plan Route</h3>
              <p>Create new route</p>
            </button>

            <button className="action-card" onClick={() => handleNavigation('/school/tracking')}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>Track Buses</h3>
              <p>Real-time tracking</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}