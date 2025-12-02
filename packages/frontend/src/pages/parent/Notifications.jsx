import React, { useState, useEffect } from 'react';
import '../../styles/parent-styles/parent-notifications.css';
import notificationService from '../../services/notificationService'; // Import Service

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // all, unread, read

    // --- HÀM GỌI API LẤY DỮ LIỆU ---
    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getAllNotifications();
            if (res.success) {
                // Map dữ liệu từ DB (tiếng Việt/Backend fields) sang UI fields
                const mappedData = res.data.map(item => ({
                    id: item.thongBaoId,
                    type: item.loai || 'info',
                    title: getTitleByType(item.loai),
                    message: item.noiDung,
                    timestamp: formatTimeAgo(item.thoiGianGui),
                    read: item.daDoc
                }));
                setNotifications(mappedData);
            }
        } catch (err) {
            console.error("Lỗi tải thông báo:", err);
        }
    };

    // --- HELPER: Tạo tiêu đề theo loại ---
    const getTitleByType = (type) => {
        switch (type) {
            case 'pickup': return 'Đã đón học sinh';
            case 'arrival': return 'Đã đến trường';
            case 'dropoff': return 'Đã trả học sinh';
            case 'alert': return 'Cảnh báo';
            default: return 'Thông báo';
        }
    };

    // --- HELPER: Format thời gian (VD: 2 phút trước) ---
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // --- POLLING: Tự động cập nhật mỗi 5 giây ---
    useEffect(() => {
        fetchNotifications(); // Gọi ngay khi vào trang
        const interval = setInterval(fetchNotifications, 5000); // Lặp lại mỗi 5s
        return () => clearInterval(interval); // Dọn dẹp
    }, []);

    // --- XỬ LÝ SỰ KIỆN ---
    const markAsRead = async (id) => {
        // Cập nhật UI ngay lập tức (Optimistic update)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        // Gọi API
        await notificationService.markAsRead(id);
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        await notificationService.markAllAsRead();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // --- UI HELPERS ---
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
            case 'dropoff':
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
            default: // info
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                );
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'pickup': return 'type-pickup';
            case 'arrival': return 'type-arrival';
            case 'dropoff': return 'type-arrival';
            case 'alert': return 'type-alert';
            default: return 'type-info';
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
                    <h1>Thông báo</h1>
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
                            Đánh dấu đã đọc hết
                        </button>
                    )}
                </div>
            </div>

            <div className="notifications-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả ({notifications.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Chưa đọc ({unreadCount})
                </button>
                <button
                    className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                    onClick={() => setFilter('read')}
                >
                    Đã đọc ({notifications.length - unreadCount})
                </button>
            </div>

            <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <p>Không có thông báo nào</p>
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;