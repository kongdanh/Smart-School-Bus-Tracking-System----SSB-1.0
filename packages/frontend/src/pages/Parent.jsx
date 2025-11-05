import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Parent.css'; // Import CSS file

// Placeholder for map integration
const MapComponent = () => {
  return (
    <div className="map-placeholder">
      <p>Bản đồ vị trí xe buýt thời gian thực sẽ được hiển thị ở đây.</p>
    </div>
  );
};

const ParentPortal = () => {
  const navigate = useNavigate();

  // --- THAY ĐỔI: Dùng state cho tab, mặc định mở tab 'tracking' ---
  const [activeTab, setActiveTab] = useState('tracking');

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // (Các state dữ liệu khác giữ nguyên)
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

  useEffect(() => {
    console.log('Fetching data...');
  }, []);

  // --- THÊM MỚI: Hàm render nội dung tab ---
  // Việc này giúp code ở dưới gọn gàng hơn
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tracking':
        return (
          <section>
            <h2>📍 Theo dõi xe thời gian thực</h2>
            <MapComponent />
            <p>Thời gian ước tính đến điểm đón/trả: 10 phút</p>
            <button className="track-btn" onClick={() => navigate("/parent/map")}>
              Xem chi tiết bản đồ
            </button>
          </section>
        );
      case 'info':
        return (
          <section>
            <h2>Thông tin học sinh</h2>
            <div className="info-card">
              <p><strong>Họ tên:</strong> {studentInfo.name}</p>
              <p><strong>Lớp:</strong> {studentInfo.class}</p>
              <p><strong>Tuyến xe:</strong> {studentInfo.route}</p>
              <p><strong>Trạng thái hiện tại:</strong> {studentInfo.status}</p>
            </div>
          </section>
        );
      case 'notify':
        return (
          <section>
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
        );
      case 'history':
        return (
          <section>
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
        );
      case 'contact':
        return (
          <section>
            <h2>Liên lạc & Hỗ trợ</h2>
            <button className="chat-btn">Chat với Tài xế</button>
            <button className="chat-btn">Chat với Nhà trường</button>
            <textarea placeholder="Gửi phản hồi..."></textarea>
            <button>Gửi</button>
            <p>Cập nhật điểm đón: <input type="text" placeholder="Địa chỉ mới" /></p>
          </section>
        );
      case 'settings':
        return (
          <section>
            <h2>Cài đặt tài khoản</h2>
            <p>Quản lý thông báo: <input type="checkbox" /> Email <input type="checkbox" /> Push</p>
            <button>Đổi mật khẩu</button>
            <a href="#">Hướng dẫn sử dụng</a>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="parent-portal">
      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>

      <header className="header">
        <h1>👨‍👩‍👧‍👦 Smart School Bus Tracking - Trang Phụ Huynh</h1>
        <p>Trang dành cho <strong>Phụ huynh</strong></p>
      </header>

      {/* --- THÊM MỚI: Thanh điều hướng Tab --- */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}>
          📍 Theo dõi
        </button>
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}>
          Thông tin HS
        </button>
        <button
          className={`tab-btn ${activeTab === 'notify' ? 'active' : ''}`}
          onClick={() => setActiveTab('notify')}>
          Thông báo
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}>
          Lịch sử
        </button>
        <button
          className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}>
          Liên lạc
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}>
          Cài đặt
        </button>
      </div>

      {/* --- THÊM MỚI: Vùng chứa nội dung Tab --- */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      <footer>
        <p>© 2025 Smart School Bus System</p>
      </footer>
    </div>
  );
};

export default ParentPortal;