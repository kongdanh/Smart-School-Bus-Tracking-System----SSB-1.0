import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Driver.css'; // Sử dụng file CSS mới

// Placeholder cho bản đồ
const MapComponent = () => {
  return (
    <div className="map-placeholder-driver">
      <p>Bản đồ lộ trình và vị trí học sinh sẽ hiển thị ở đây.</p>
    </div>
  );
};

const DriverPortal = () => {
  const navigate = useNavigate();

  // State cho tab, mặc định mở 'trip' (hành trình)
  const [activeTab, setActiveTab] = useState('trip');

  // --- Nút SOS Khẩn cấp ---
  const handleSOS = () => {
    // Logic gửi báo động khẩn cấp đến nhà trường và phụ huynh
    alert('ĐÃ KÍCH HOẠT BÁO ĐỘNG KHẨN CẤP!\nNhà trường đã được thông báo.');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // --- Dữ liệu giả lập ---
  const [tripInfo, setTripInfo] = useState({
    routeName: 'Tuyến A - Sáng',
    nextStop: '123 Nguyễn Huệ, Q.1',
    eta: '5 phút',
  });

  const [studentList, setStudentList] = useState([
    { id: 1, name: 'Nguyễn Văn A', status: 'Chờ đón' },
    { id: 2, name: 'Trần Thị B', status: 'Chờ đón' },
    { id: 3, name: 'Lê Văn C', status: 'Vắng mặt' },
    { id: 4, name: 'Phạm Thị D', status: 'Đã đón' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, from: 'Admin', text: 'Tuyến A chú ý, hôm nay đón thêm em X ở 456 Lý Thường Kiệt.' },
    { id: 2, from: 'Phụ huynh HS A', text: 'Cháu hôm nay nghỉ ốm nhé tài xế.' },
  ]);

  // Hàm (ví dụ) để cập nhật trạng thái học sinh
  const updateStudentStatus = (id, newStatus) => {
    setStudentList(studentList.map(s =>
      s.id === id ? { ...s, status: newStatus } : s
    ));
    console.log(`Cập nhật ID ${id} thành ${newStatus}`);
  };

  // --- Render nội dung các Tab ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'trip':
        return (
          <section>
            <h2>🗺️ Hành trình hôm nay: {tripInfo.routeName}</h2>
            <div className="info-card-driver">
              <p><strong>Điểm dừng tiếp theo:</strong> {tripInfo.nextStop}</p>
              <p><strong>Dự kiến đến (ETA):</strong> {tripInfo.eta}</p>
            </div>
            <MapComponent />
            <button className="nav-btn">Mở ứng dụng điều hướng (Google Maps)</button>
          </section>
        );
      case 'attendance':
        return (
          <section>
            <h2>📋 Điểm danh học sinh</h2>
            <div className="student-list-container">
              {studentList.map(student => (
                <div key={student.id} className={`student-item status-${student.status}`}>
                  <div className="student-info">
                    <strong>{student.name}</strong>
                    <span>Trạng thái: {student.status}</span>
                  </div>
                  <div className="attendance-actions">
                    <button
                      className="btn-present"
                      onClick={() => updateStudentStatus(student.id, 'Đã đón')}>
                      Đón
                    </button>
                    <button
                      className="btn-dropped"
                      onClick={() => updateStudentStatus(student.id, 'Đã trả')}>
                      Trả
                    </button>
                    <button
                      className="btn-absent"
                      onClick={() => updateStudentStatus(student.id, 'Vắng mặt')}>
                      Vắng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'messages':
        return (
          <section>
            <h2>💬 Tin nhắn & Thông báo</h2>
            <div className="message-feed">
              {messages.map(msg => (
                <div key={msg.id} className="message-item">
                  <strong>Từ: {msg.from}</strong>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <textarea placeholder="Gửi tin nhắn nhanh..."></textarea>
            <button>Gửi cho Admin</button>
          </section>
        );
      case 'account':
        return (
          <section>
            <h2>👤 Thông tin tài xế</h2>
            <div className="info-card-driver">
              <p><strong>Tên:</strong> Bùi Văn T</p>
              <p><strong>Xe:</strong> 51B-123.45</p>
              <p><strong>Số điện thoại:</strong> 090 xxx xxxx</p>
            </div>
            <button>Xem lịch sử chuyến đi</button>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="driver-portal">
      {/* Nút SOS luôn hiển thị */}
      <button className="sos-btn" onClick={handleSOS}>
        🆘 KHẨN CẤP
      </button>

      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>

      <header className="header-driver">
        <h1>🚌 Smart School Bus - Trang Tài xế</h1>
        <p>Xin chào, Tài xế Bùi Văn T</p>
      </header>

      {/* --- Thanh điều hướng Tab --- */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'trip' ? 'active' : ''}`}
          onClick={() => setActiveTab('trip')}>
          🗺️ Hành trình
        </button>
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}>
          📋 Điểm danh
        </button>
        <button
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}>
          💬 Tin nhắn
        </button>
        <button
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}>
          👤 Tài khoản
        </button>
      </div>

      {/* --- Vùng chứa nội dung Tab --- */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      <footer className="footer-driver">
        <p>© 2025 Smart School Bus System</p>
      </footer>
    </div>
  );
};

export default DriverPortal;