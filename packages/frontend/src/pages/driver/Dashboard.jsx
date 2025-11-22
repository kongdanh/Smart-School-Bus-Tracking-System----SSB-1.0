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
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
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
            <h3>You're On Duty</h3>
            <p>Ready to start your trips</p>
          </div>
          <div className="status-time">
            <span className="pulse-dot"></span>
            Active
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card trips">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Trips</div>
            <div className="stat-value">{stats.totalTrips}</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Completed Today</div>
            <div className="stat-value">{stats.completedToday}</div>
          </div>
        </div>

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
            <div className="stat-label">Students on Board</div>
            <div className="stat-value">{stats.studentsOnBoard}</div>
          </div>
        </div>

        <div className="stat-card rating">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Your Rating</div>
            <div className="stat-value">{stats.rating.toFixed(1)}</div>
          </div>
        </div>
      </div>

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

      {/* Quick Actions */}
      {!currentTrip && checkedIn && (
        <div className="quick-actions-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-card" onClick={handleStartTrip}>
              <div className="action-icon start">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <h3>Start Trip</h3>
              <p>Begin your scheduled route</p>
            </button>

            <button className="action-card" onClick={() => navigate('/driver/trips')}>
              <div className="action-icon schedule">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3>View Schedule</h3>
              <p>Check today's trips</p>
            </button>

            <button className="action-card" onClick={() => navigate('/driver/history')}>
              <div className="action-icon history">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>Trip History</h3>
              <p>View past trips</p>
            </button>

            <button className="action-card" onClick={() => navigate('/driver/profile')}>
              <div className="action-icon profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Profile</h3>
              <p>Update your information</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;