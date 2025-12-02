import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import driverService from '../../services/driverService';
import { toast } from 'react-toastify';
import '../../styles/driver-styles/driver-dashboard.css';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedToday: 0,
    studentsOnBoard: 0,
    rating: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await driverService.getDashboard();

      if (response.success) {
        setStats(response.data.stats);
        setCurrentTrip(response.data.currentTrip);
        setCheckedIn(response.data.checkedIn);
      } else {
        toast.warning('Không thể tải dữ liệu dashboard');
        setStats({
          totalTrips: 0,
          completedToday: 0,
          studentsOnBoard: 0,
          rating: 0
        });
        setCurrentTrip(null);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await driverService.checkIn();
      if (response.success) {
        setCheckedIn(true);
        toast.success('Checked in successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (window.confirm('Are you sure you want to check out?')) {
      try {
        const response = await driverService.checkOut();
        if (response.success) {
          setCheckedIn(false);
          toast.success('Checked out successfully!');
          fetchDashboardData();
        }
      } catch (error) {
        toast.error('Failed to check out');
      }
    }
  };

  const handleStartTrip = () => {
    navigate('/driver/trips/active');
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
    <div className="driver-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Driver Dashboard</h1>
          <p className="dashboard-subtitle">Manage your trips and student attendance</p>
        </div>
        <div className="header-actions">
          {!checkedIn ? (
            <button className="btn-checkin" onClick={handleCheckIn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Check In
            </button>
          ) : (
            <button className="btn-checkout" onClick={handleCheckOut}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              Check Out
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {checkedIn && (
        <div className="status-banner checked-in">
          <div className="status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="status-content">
            <h3>Bạn Đã Check In</h3>
            <p>Sẵn sàng làm việc</p>
          </div>
          <div className="status-time">
            <span className="pulse-dot"></span>
            Đang Làm Việc
          </div>
        </div>
      )}

      {!checkedIn && (
        <div className="status-banner checked-out">
          <div className="status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="status-content">
            <h3>Bạn Đã Check Out</h3>
            <p>Kết thúc ca làm việc</p>
          </div>
        </div>
      )}

      {/* Current Trip */}
      {currentTrip && (
        <div className="current-trip-section">
          <div className="section-header">
            <h2>Current Trip</h2>
            <span className="trip-status active">In Progress</span>
          </div>
          <div className="trip-card">
            <div className="trip-header">
              <div className="trip-info">
                <h3>{currentTrip.routeName}</h3>
                <p>{currentTrip.busNumber}</p>
              </div>
              <div className="trip-time">
                <span className="time-label">Started at</span>
                <span className="time-value">{currentTrip.startTime}</span>
              </div>
            </div>
            <div className="trip-details">
              <div className="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{currentTrip.currentStop}</span>
              </div>
              <div className="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>{currentTrip.studentsCount} students</span>
              </div>
            </div>
            <div className="trip-actions">
              <button className="btn-primary" onClick={() => navigate('/driver/attendance')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Take Attendance
              </button>
              <button className="btn-secondary" onClick={() => navigate('/driver/trips/active')}>
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Trip Section */}
      {!currentTrip && checkedIn && (
        <div className="no-trip-section" style={{
          padding: '24px',
          backgroundColor: '#0f3460',
          borderRadius: '8px',
          marginBottom: '24px',
          textAlign: 'center',
          border: '2px solid #444'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#f59e0b' }}>
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <h3>Không có lịch trình hôm nay</h3>
          <p>Bạn sẽ được thông báo khi có lịch trình mới</p>
        </div>
      )}


    </div>
  );
};

export default DriverDashboard;