import React, { useState } from 'react';
import '../../styles/parent-notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'pickup',
            title: 'Student Picked Up',
            message: 'Nguyễn Minh A has been picked up at 08:10 AM',
            timestamp: '2 min ago',
            read: false
        },
        {
            id: 2,
            type: 'arrival',
            title: 'Student Arrived',
            message: 'Trần Thị B has arrived at school',
            timestamp: '5 min ago',
            read: false
        },
        {
            id: 3,
            type: 'alert',
            title: 'Delayed Pickup',
            message: 'Bus is delayed by 5 minutes',
            timestamp: '10 min ago',
            read: true
        },
        {
            id: 4,
            type: 'info',
            title: 'Route Changed',
            message: 'Route for tomorrow has been updated',
            timestamp: '1 hour ago',
            read: true
        },
        {
            id: 5,
            type: 'alert',
            title: 'Weather Alert',
            message: 'Heavy rain expected. Please prepare accordingly.',
            timestamp: '2 hours ago',
            read: true
        }
    ]);

    const [filter, setFilter] = useState('all'); // all, unread, read

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'pickup':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                );
            case 'arrival':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                );
            case 'alert':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
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
            default:
                return null;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'pickup':
                return 'type-pickup';
            case 'arrival':
                return 'type-arrival';
            case 'alert':
                return 'type-alert';
            case 'info':
                return 'type-info';
            default:
                return '';
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <div className="header-left">
                    <h1>Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                    )}
                </div>
                <div className="header-actions">
                    {unreadCount > 0 && (
                        <button className="btn-mark-all" onClick={markAllAsRead}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

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

            <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <p>No notifications</p>
                    </div>
                ) : (
                    filteredNotifications.map(notif => (
                        <div
                            key={notif.id}
                            className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                            onClick={() => markAsRead(notif.id)}
                        >
                            <div className={`notification-icon ${getTypeColor(notif.type)}`}>
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
                                        {notif.timestamp}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="notification-action"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notif.id);
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;