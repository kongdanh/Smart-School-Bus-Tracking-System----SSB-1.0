import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Parent.css'; // Import CSS file

// Placeholder for map integration (e.g., using react-google-maps or leaflet)
const MapComponent = () => {
  return (
    <div className="map-placeholder">
      {/* Integrate actual map library here */}
      <p>Bản đồ vị trí xe buýt thời gian thực sẽ được hiển thị ở đây.</p>
    </div>
  );
};

const ParentPortal = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa JWT token khỏi localStorage
    localStorage.removeItem("token");
    // (Tùy chọn) Xóa thêm các thông tin khác nếu bạn có lưu
    // localStorage.removeItem("user");
    // Chuyển hướng về trang đăng nhập
    navigate("/");
  };

  const [studentInfo, setStudentInfo] = useState({
    name: 'Nguyễn Văn A',
    class: 'Lớp 5',
    route: 'Tuyến A',
    status: 'Đang trên xe'
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Xe buýt đang đến trong 5 phút.', time: '10:00 AM' },
    { id: 2, message: 'Con đã được trả về nhà an toàn.', time: '3:30 PM' }
  ]);

  const [tripHistory, setTripHistory] = useState([
    { date: '2025-10-31', pickupTime: '7:45 AM', dropoffTime: '3:45 PM', status: 'Đúng giờ' },
    { date: '2025-10-30', pickupTime: '7:50 AM', dropoffTime: '3:50 PM', status: 'Trễ' }
  ]);

  // Simulate fetching data from API
  useEffect(() => {
    // In real app, fetch from backend API
    console.log('Fetching data...');
  }, []);

  return (
    <div className="parent-portal">
      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>

      <header className="header">
        <h1>👨‍👩‍👧‍👦 Smart School Bus Tracking - Trang Phụ Huynh</h1>
        <p>Trang dành cho <strong>Phụ huynh</strong></p>
      </header>

      <section className="real-time-tracking">
        <h2>📍 Theo dõi xe thời gian thực</h2>
        <MapComponent />
        <p>Thời gian ước tính đến điểm đón/trả: 10 phút</p>
        <button className="track-btn" onClick={() => navigate("/parent/map")}>
          Xem chi tiết bản đồ
        </button>
      </section>

      <section className="student-info">
        <h2>Thông tin học sinh</h2>
        <div className="info-card">
          <p><strong>Họ tên:</strong> {studentInfo.name}</p>
          <p><strong>Lớp:</strong> {studentInfo.class}</p>
          <p><strong>Tuyến xe:</strong> {studentInfo.route}</p>
          <p><strong>Trạng thái hiện tại:</strong> {studentInfo.status}</p>
        </div>
      </section>

      <section className="notifications">
        <h2>Thông báo</h2>
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>
              {notif.message} - {notif.time}
            </li>
          ))}
        </ul>
        <p>Kích hoạt thông báo đẩy trong cài đặt.</p>
      </section>

      <section className="trip-history">
        <h2>Lịch sử chuyến đi</h2>
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Giờ đón</th>
              <th>Giờ trả</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {tripHistory.map((trip, index) => (
              <tr key={index}>
                <td>{trip.date}</td>
                <td>{trip.pickupTime}</td>
                <td>{trip.dropoffTime}</td>
                <td>{trip.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="communication">
        <h2>Liên lạc & Hỗ trợ</h2>
        <button className="chat-btn">Chat với Tài xế</button>
        <button className="chat-btn">Chat với Nhà trường</button>
        <textarea placeholder="Gửi phản hồi..."></textarea>
        <button>Gửi</button>
        <p>Cập nhật điểm đón: <input type="text" placeholder="Địa chỉ mới" /></p>
      </section>

      <section className="settings">
        <h2>Cài đặt tài khoản</h2>
        <p>Quản lý thông báo: <input type="checkbox" /> Email <input type="checkbox" /> Push</p>
        <button>Đổi mật khẩu</button>
        <a href="#">Hướng dẫn sử dụng</a>
      </section>

      <footer>
        <p>© 2025 Smart School Bus System</p>
      </footer>
    </div>
  );
};

export default ParentPortal;