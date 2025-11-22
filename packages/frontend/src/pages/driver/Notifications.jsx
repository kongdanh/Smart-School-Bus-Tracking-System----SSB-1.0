import React from 'react';
import '../../styles/driver-styles/driver-notifications.css';

const Notifications = () => {
    const notifications = [
        { id: 1, type: 'warning', title: 'Xe trễ 10 phút', message: 'Chuyến 7:30 sáng bị trễ do kẹt xe', time: '5 phút trước' },
        { id: 2, type: 'info', title: 'Học sinh vắng', message: 'Em Nguyễn Thị B vắng có phép', time: '15 phút trước' },
        { id: 3, type: 'success', title: 'Check-in thành công', message: 'Bạn đã điểm danh lúc 6:45 AM', time: '1 giờ trước' },
        { id: 4, type: 'alert', title: 'Cảnh báo tốc độ', message: 'Tốc độ vượt quá 60km/h lúc 7:12', time: '2 giờ trước' },
    ];

    return (
        <div className="notifications-page">
            <div className="page-header">
                <h1>Thông báo</h1>
                <button className="mark-all-read">Đánh dấu tất cả đã đọc</button>
            </div>

            <div className="notifications-list">
                {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.type} unread`}>
                        <div className="notif-icon">
                            <div className="icon-circle"></div>
                        </div>
                        <div className="notif-content">
                            <h3>{notif.title}</h3>
                            <p>{notif.message}</p>
                            <span className="notif-time">{notif.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;