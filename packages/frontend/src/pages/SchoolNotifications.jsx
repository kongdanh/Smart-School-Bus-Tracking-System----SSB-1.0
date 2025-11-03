import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SchoolNotifications.css";

export default function SchoolNotifications() {
  const navigate = useNavigate();

  const [notifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Xe buýt 29B-67890 báo cáo chậm trễ",
      message: "Xe buýt đang bị kẹt xe trên đường Nguyễn Huệ, dự kiến chậm 15 phút",
      time: "5 phút trước",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      type: "info",
      title: "Cập nhật tuyến đường A1",
      message: "Tuyến đường A1 đã được cập nhật với 2 điểm dừng mới",
      time: "1 giờ trước",
      read: false,
      priority: "medium"
    },
    {
      id: 3,
      type: "success",
      title: "Hoàn thành chuyến đi",
      message: "Xe buýt 29B-12345 đã hoàn thành tuyến C3 an toàn",
      time: "2 giờ trước",
      read: true,
      priority: "low"
    },
    {
      id: 4,
      type: "warning",
      title: "Bảo trì xe buýt định kỳ",
      message: "Xe buýt 29B-11111 cần bảo trì định kỳ vào tuần tới",
      time: "3 giờ trước",
      read: true,
      priority: "medium"
    },
    {
      id: 5,
      type: "info",
      title: "Thông báo từ phụ huynh",
      message: "Phụ huynh học sinh Nguyễn Văn A yêu cầu thay đổi điểm đón",
      time: "1 ngày trước",
      read: true,
      priority: "low"
    }
  ]);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") === "true") {
      localStorage.removeItem("justLoggedIn");

      const user = authService.getCurrentUser();
      const userName = user?.name || user?.email || "bạn";

      toast.success(`Chào ${userName}!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
  };


  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleMarkAsRead = (id) => {
    console.log("Đánh dấu đã đọc:", id);
  };

  const handleDeleteNotification = (id) => {
    console.log("Xóa thông báo:", id);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="school-notifications-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🏫</span>
            <div className="logo-text">
              <h1>Smart School Bus Tracking</h1>
              <p>Trang dành cho Nhà Trường</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button className="nav-item" onClick={() => handleNavigation('/school/dashboard')}>
          📊 Tổng quan
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/students')}>
          👥 Học sinh
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/drivers')}>
          🚗 Tài xế
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/buses')}>
          🚌 Xe buýt
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/routes')}>
          🗺️ Tuyến đường
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/tracking')}>
          📍 Theo dõi
        </button>
        <button className="nav-item notification active" onClick={() => handleNavigation('/school/notifications')}>
          🔔 Tin nhắn <span className="badge">{unreadCount}</span>
        </button>
      </nav>

      <main className="notifications-main">
        <div className="notifications-header">
          <h2>🔔 Tin nhắn và thông báo</h2>
          <p>Quản lý các thông báo và tin nhắn hệ thống</p>
        </div>

        <div className="notifications-content">
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
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'} priority-${notification.priority}`}
              >
                <div className="notification-icon">
                  {notification.type === 'alert' && '🚨'}
                  {notification.type === 'warning' && '⚠️'}
                  {notification.type === 'info' && 'ℹ️'}
                  {notification.type === 'success' && '✅'}
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-priority">
                    <span className={`priority-badge ${notification.priority}`}>
                      {notification.priority === 'high' && 'Cao'}
                      {notification.priority === 'medium' && 'Trung bình'}
                      {notification.priority === 'low' && 'Thấp'}
                    </span>
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="action-btn mark-read"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Đánh dấu đã đọc"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteNotification(notification.id)}
                    title="Xóa thông báo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Không có thông báo</h3>
              <p>Hiện tại không có thông báo nào trong danh mục này</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}