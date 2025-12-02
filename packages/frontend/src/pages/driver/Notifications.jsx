import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';
import '../../styles/driver-styles/driver-notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Load notifications from backend
    useEffect(() => {
        fetchNotifications();

        // Poll mỗi 5 giây để cập nhật thông báo mới
        const pollInterval = setInterval(fetchNotifications, 5000);

        return () => clearInterval(pollInterval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationService.getAllNotifications();

            if (res.success) {
                setNotifications(res.data || []);
            } else {
                // Nếu backend chưa có endpoint này, fallback to mock
                console.warn('Using mock notifications - backend endpoint not ready');
                setNotifications(getMockNotifications());
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Fallback to mock data nếu API không hoạt động
            setNotifications(getMockNotifications());
        } finally {
            setLoading(false);
        }
    };

    // Mock data - fallback nếu API chưa có
    const getMockNotifications = () => [
        { id: 1, type: 'warning', title: 'Xe trễ 10 phút', message: 'Chuyến 7:30 sáng bị trễ do kẹt xe 5 phút trước', time: '5 phút trước', unread: true, icon: '⚠️' },
        { id: 2, type: 'info', title: 'Học sinh vắng', message: 'Em Nguyễn Thị B vắng có phép 15 phút trước', time: '15 phút trước', unread: true, icon: '👤' },
        { id: 3, type: 'success', title: 'Check-in thành công', message: 'Bạn đã điểm danh lúc 6:45 AM 1 giờ trước', time: '1 giờ trước', unread: false, icon: '✅' },
        { id: 4, type: 'alert', title: 'Cảnh báo tốc độ', message: 'Tốc độ vượt quá 60km/h lúc 7:12 2 giờ trước', time: '2 giờ trước', unread: false, icon: '🚨' },
        { id: 5, type: 'info', title: 'Bảo trì định kỳ', message: 'Xe cần bảo trì vào ngày mai', time: '3 giờ trước', unread: false, icon: '🔧' },
        { id: 6, type: 'success', title: 'Hoàn thành chuyến', message: 'Chuyến buổi sáng đã hoàn thành xuất sắc', time: '4 giờ trước', unread: false, icon: '🎉' },
    ];

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, unread: false } : n
            ));
            toast.success('Đã đánh dấu đã đọc', { position: 'bottom-right', autoClose: 2000 });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            toast.success('Đã đánh dấu tất cả đã đọc', { position: 'bottom-right', autoClose: 2000 });
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const filteredNotifs = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => n.unread)
            : notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => n.unread).length;

    if (loading) {
        return (
            <div className="notifications-page-modern">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Đang tải thông báo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page-modern">
            {/* UPDATED HEADER - Consistent */}
            <div className="page-header-consistent">
                <div className="header-left">
                    <h1>Thông Báo</h1>
                    <p className="page-subtitle">Cập nhật mới nhất về chuyến xe và hệ thống</p>
                </div>
                {unreadCount > 0 && (
                    <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Đánh dấu đã đọc ({unreadCount})
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="notif-filters">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                    Tất cả ({notifications.length})
                </button>
                <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>
                    Chưa đọc ({unreadCount})
                </button>
                <button className={filter === 'warning' ? 'active' : ''} onClick={() => setFilter('warning')}>
                    Cảnh báo
                </button>
                <button className={filter === 'info' ? 'active' : ''} onClick={() => setFilter('info')}>
                    Thông tin
                </button>
                <button className={filter === 'success' ? 'active' : ''} onClick={() => setFilter('success')}>
                    Thành công
                </button>
            </div>

            {/* Notifications List */}
            <div className="notifications-list-modern">
                {filteredNotifs.length > 0 ? (
                    filteredNotifs.map(notif => (
                        <div key={notif.id} className={`notif-card ${notif.type} ${notif.unread ? 'unread' : ''}`}>
                            <div className="notif-icon-modern">{notif.icon}</div>
                            <div className="notif-content-modern">
                                <div className="notif-header-flex">
                                    <h3>{notif.title}</h3>
                                    {notif.unread && <span className="unread-dot"></span>}
                                </div>
                                <p>{notif.message}</p>
                                <span className="notif-time-modern">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {notif.time}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-notifs">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <p>Không có thông báo nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;