import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driverService from "../../services/driverService";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import "../../styles/driver-styles/driver-dashboard.css";

export default function DriverDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [stats, setStats] = useState({
        studentsToday: 0,
        completedTrips: 0,
        totalTrips: 0,
        attendance: 0,
        routeDistance: "0 km"
    });
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);

    useEffect(() => {
        fetchDashboardData();

        if (localStorage.getItem("justLoggedIn") === "true") {
            localStorage.removeItem("justLoggedIn");
            const user = authService.getCurrentUser();
            const userName = user?.name || user?.email || "Driver";
            toast.success(`Welcome back, ${userName}!`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await driverService.getDashboard();

            if (response.success) {
                const { statistics, schedule, checkInStatus, currentTrip } = response.data;
                setStats({
                    studentsToday: statistics.studentsToday || 0,
                    completedTrips: statistics.completedTrips || 0,
                    totalTrips: statistics.totalTrips || 0,
                    attendance: statistics.attendance || 0,
                    routeDistance: statistics.routeDistance || "0 km"
                });
                setTodaySchedule(schedule || []);
                setIsCheckedIn(checkInStatus || false);
                setCurrentTrip(currentTrip || null);
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

    const handleCheckIn = async () => {
        try {
            const response = await driverService.checkIn();
            if (response.success) {
                setIsCheckedIn(true);
                toast.success("Checked in successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
                fetchDashboardData();
            }
        } catch (error) {
            toast.error("Failed to check in. Please try again.", {
                position: "bottom-right",
            });
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await driverService.checkOut();
            if (response.success) {
                setIsCheckedIn(false);
                toast.success("Checked out successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
                fetchDashboardData();
            }
        } catch (error) {
            toast.error("Failed to check out. Please try again.", {
                position: "bottom-right",
            });
        }
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
        <div className="driver-dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Driver Dashboard</h1>
                    <p className="dashboard-subtitle">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="header-actions">
                    {!isCheckedIn ? (
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
                    <button className="btn-refresh" onClick={fetchDashboardData}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Status Banner */}
            {isCheckedIn && (
                <div className="status-banner active">
                    <div className="status-indicator">
                        <span className="pulse"></span>
                        <span className="status-text">On Duty</span>
                    </div>
                    {currentTrip && (
                        <div className="current-trip-info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="10" r="3" />
                                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                            </svg>
                            <span>Current Route: {currentTrip.routeName}</span>
                        </div>
                    )}
                </div>
            )}

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
                        <div className="stat-label">Students Today</div>
                        <div className="stat-value">{stats.studentsToday}</div>
                        <div className="stat-change neutral">On your route</div>
                    </div>
                </div>

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
                        <div className="stat-label">Trips Progress</div>
                        <div className="stat-value">{stats.completedTrips}/{stats.totalTrips}</div>
                        <div className="stat-change positive">
                            {Math.round((stats.completedTrips / stats.totalTrips) * 100)}% completed
                        </div>
                    </div>
                </div>

                <div className="stat-card attendance">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Attendance Rate</div>
                        <div className="stat-value">{stats.attendance}%</div>
                        <div className="stat-change positive">Excellent performance</div>
                    </div>
                </div>

                <div className="stat-card distance">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="6" cy="19" r="3" />
                            <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                            <circle cx="18" cy="5" r="3" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Route Distance</div>
                        <div className="stat-value">{stats.routeDistance}</div>
                        <div className="stat-change neutral">Today's route</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Today's Schedule */}
                <div className="schedule-section">
                    <div className="section-header">
                        <h2>Today's Schedule</h2>
                        <button className="btn-view-all" onClick={() => handleNavigation('/driver/schedule')}>
                            View All
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>

                    {todaySchedule.length > 0 ? (
                        <div className="schedule-list">
                            {todaySchedule.map((trip, index) => (
                                <div
                                    key={trip.id}
                                    className={`schedule-item ${trip.status} ${currentTrip?.id === trip.id ? 'active' : ''}`}
                                >
                                    <div className="schedule-time">
                                        <div className="time-badge">{trip.time}</div>
                                        <div className={`status-indicator ${trip.status}`}></div>
                                    </div>
                                    <div className="schedule-details">
                                        <h3>{trip.routeName}</h3>
                                        <div className="schedule-meta">
                                            <span className="meta-item">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                </svg>
                                                {trip.studentCount} students
                                            </span>
                                            <span className="meta-item">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="10" r="3" />
                                                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                                                </svg>
                                                {trip.stops} stops
                                            </span>
                                        </div>
                                    </div>
                                    {trip.status === 'pending' && isCheckedIn && (
                                        <button
                                            className="btn-start-trip"
                                            onClick={() => handleNavigation(`/driver/trip/${trip.id}`)}
                                        >
                                            Start Trip
                                        </button>
                                    )}
                                    {trip.status === 'completed' && (
                                        <div className="completed-badge">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                            Completed
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <p>No trips scheduled for today</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>

                    <div className="quick-actions-grid">
                        <button
                            className="action-card"
                            onClick={() => handleNavigation('/driver/attendance')}
                            disabled={!isCheckedIn}
                        >
                            <div className="action-icon attendance">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 11l3 3L22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                            </div>
                            <div className="action-content">
                                <h3>Take Attendance</h3>
                                <p>Mark student presence</p>
                            </div>
                        </button>

                        <button
                            className="action-card"
                            onClick={() => handleNavigation('/driver/route')}
                        >
                            <div className="action-icon route">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="10" r="3" />
                                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                                </svg>
                            </div>
                            <div className="action-content">
                                <h3>View Route</h3>
                                <p>Check today's route</p>
                            </div>
                        </button>

                        <button
                            className="action-card"
                            onClick={() => handleNavigation('/driver/students')}
                        >
                            <div className="action-icon students">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div className="action-content">
                                <h3>Student List</h3>
                                <p>View assigned students</p>
                            </div>
                        </button>

                        <button
                            className="action-card"
                            onClick={() => handleNavigation('/driver/notifications')}
                        >
                            <div className="action-icon notifications">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>
                            <div className="action-content">
                                <h3>Notifications</h3>
                                <p>View messages & alerts</p>
                            </div>
                        </button>

                        <button
                            className="action-card"
                            onClick={() => handleNavigation('/driver/history')}
                        >
                            <div className="action-icon history">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div className="action-content">
                                <h3>Trip History</h3>
                                <p>View past trips</p>
                            </div>
                        </button>

                        <button
                            className="action-card"
                            onClick={() => handleNavigation('/driver/profile')}
                        >
                            <div className="action-icon profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div className="action-content">
                                <h3>My Profile</h3>
                                <p>Update information</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}