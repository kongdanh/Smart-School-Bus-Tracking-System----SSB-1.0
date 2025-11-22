import React, { useState } from 'react';
import '../../styles/school-styles/school-notifications.css';

const Notifications = () => {
  const [filter, setFilter] = useState('all');

  // Mock data từ Prisma schema
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Bus Delay Alert',
      message: 'Bus 29B-67890 is running 15 minutes behind schedule due to traffic on Nguyen Hue Street',
      time: '5 min ago',
      read: false,
      priority: 'high',
      sender: 'System'
    },
    {
      id: 2,
      type: 'info',
      title: 'Route Update',
      message: 'Route A has been updated with 2 new stops. Please review the changes.',
      time: '1 hour ago',
      read: false,
      priority: 'medium',
      sender: 'Admin'
    },
    {
      id: 3,
      type: 'success',
      title: 'Trip Completed',
      message: 'Bus 29B-12345 has successfully completed Route C with all students safely delivered',
      time: '2 hours ago',
      read: true,
      priority: 'low',
      sender: 'Driver'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Maintenance Due',
      message: 'Bus 29B-11111 requires scheduled maintenance next week. Please arrange accordingly.',
      time: '3 hours ago',
      read: true,
      priority: 'medium',
      sender: 'System'
    },
    {
      id: 5,
      type: 'info',
      title: 'Parent Request',
      message: 'Parent of student Nguyen Van A has requested a pickup point change',
      time: '1 day ago',
      read: true,
      priority: 'low',
      sender: 'Parent'
    },
    {
      id: 6,
      type: 'alert',
      title: 'Driver Absence',
      message: 'Driver Tran Van Binh has reported sick leave for tomorrow. Replacement needed.',
      time: '1 day ago',
      read: true,
      priority: 'high',
      sender: 'Driver'
    }
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'warning':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case 'info':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      case 'success':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="school-notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-left">
          <h1>Messages & Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Mark all as read
            </button>
          )}
          <button className="btn-compose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Message
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              className={`notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}`}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
            >
              <div className={`notification-icon ${notif.type}`}>
                {getTypeIcon(notif.type)}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notif.title}</h3>
                  {!notif.read && <div className="unread-dot"></div>}
                </div>
                <p>{notif.message}</p>
                <div className="notification-footer">
                  <span className="notification-time">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {notif.time}
                  </span>
                  <span className="notification-sender">
                    From: {notif.sender}
                  </span>
                  <span className={`priority-badge ${notif.priority}`}>
                    {notif.priority}
                  </span>
                </div>
              </div>

              <div className="notification-actions">
                {!notif.read && (
                  <button
                    className="action-btn mark-read"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notif.id);
                    }}
                    title="Mark as read"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                )}
                <button
                  className="action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notif.id);
                  }}
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;