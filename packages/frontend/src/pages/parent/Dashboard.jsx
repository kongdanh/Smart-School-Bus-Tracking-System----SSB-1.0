import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/parent-styles/parent-dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [children] = useState([
    {
      id: 1,
      name: 'Nguyễn Minh A',
      status: 'on-bus',
      lastUpdate: '2 min ago',
      statusText: 'On Bus',
      location: 'Đường Nguyễn Hữu Cảnh',
      class: 'Class 5A'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      status: 'arrived',
      lastUpdate: '5 min ago',
      statusText: 'Arrived',
      location: 'School - No. 1',
      class: 'Class 4B'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      status: 'home',
      lastUpdate: '1 hour ago',
      statusText: 'Home',
      location: 'Home Address',
      class: 'Class 3A'
    }
  ]);

  const [stats] = useState({
    onTimeRate: 98,
    totalTrips: 12,
    avgDuration: '8.3 min',
    totalDistance: 275,
  });

  const quickActions = [
    {
      title: 'Live Tracking',
      description: 'Track your child\'s location in real-time',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      path: '/parent/tracking',
      color: 'blue'
    },
    {
      title: 'Trip History',
      description: 'View past trips and detailed reports',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      ),
      path: '/parent/history',
      color: 'cyan'
    },
    {
      title: 'Support',
      description: 'Get help from our support team',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      path: '/parent/communication',
      color: 'orange'
    },
    {
      title: 'Notifications',
      description: 'Manage your notification settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      path: '/parent/notifications',
      color: 'green'
    },
  ];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Welcome Back</h1>
            <p>Here's an overview of your children's trips today</p>
          </div>
          <div className="welcome-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Children Section */}
      <section className="children-section">
        <div className="section-header">
          <h2>Your Children</h2>
          <span className="badge">{children.length} students</span>
        </div>
        <div className="children-grid">
          {children.map(child => (
            <div key={child.id} className="child-card" onClick={() => navigate('/parent/tracking')}>
              <div className="child-header">
                <div className="child-avatar">
                  {child.name.charAt(0)}
                </div>
                <div className="child-info">
                  <h3>{child.name}</h3>
                  <p className="child-class">{child.class}</p>
                </div>
              </div>

              <div className={`child-status status-${child.status}`}>
                <span className="status-dot"></span>
                {child.statusText}
              </div>

              <div className="child-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{child.location}</span>
              </div>

              <div className="child-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Updated {child.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-header">
          <h2>Monthly Statistics</h2>
          <span className="stats-period">November 2024</span>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon on-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.onTimeRate}%</div>
              <div className="stat-label">On-Time Rate</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon trips">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalTrips}</div>
              <div className="stat-label">Total Trips</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon duration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.avgDuration}</div>
              <div className="stat-label">Avg Duration</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon distance">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="21 8 21 21 3 21 3 8" />
                <rect x="1" y="3" width="22" height="5" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalDistance} km</div>
              <div className="stat-label">Total Distance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-links-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-links">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`quick-link color-${action.color}`}
              onClick={() => navigate(action.path)}
            >
              <div className="link-icon">
                {action.icon}
              </div>
              <div className="link-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="link-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;