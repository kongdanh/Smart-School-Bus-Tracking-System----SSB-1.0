import React from 'react';
import '../../pages/parent/styles/NotificationItem.css';

const NotificationItem = ({ notification }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'pickup': return '🚌';
            case 'arrival': return '✅';
            case 'alert': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '•';
        }
    };

    return (
        <div className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
            <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
            </div>
            <div className="notification-time">{notification.timestamp}</div>
        </div>
    );
};

export default NotificationItem;
