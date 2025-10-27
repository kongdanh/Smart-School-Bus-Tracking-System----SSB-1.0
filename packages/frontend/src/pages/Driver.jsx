import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Driver.css";

// Lấy API URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Driver() {
  const navigate = useNavigate();

  // State để lưu lịch trình và các trạng thái khác
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${API_URL}/api/driver/schedule`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể tải lịch trình");
        }

        const data = await response.json();
        setSchedules(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần

  const handleLogout = () => {
    // Xóa JWT token khỏi localStorage
    localStorage.removeItem("token");

    // (Tùy chọn) Xóa thêm các thông tin khác nếu bạn có lưu, ví dụ:
    // localStorage.removeItem("user");

    // Chuyển hướng về trang đăng nhập
    navigate("/");
  };


  const handleIncidentReport = () => {
    const incident = prompt("Vui lòng mô tả sự cố:");
    if (incident) {
      console.log("Đã gửi cảnh báo sự cố:", incident);
      alert("Đã gửi cảnh báo thành công!");
    }
  };

  // Hàm render nội dung lịch trình dựa trên trạng thái
  const renderScheduleContent = () => {
    if (isLoading) {
      return <p>Đang tải lịch trình...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>Lỗi: {error}</p>;
    }
    if (schedules.length === 0) {
      return <p>Bạn không có lịch trình nào cho hôm nay.</p>;
    }
    return (
      <ul className="schedule-list">
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            <strong>Tuyến: {schedule.tuyenDuong?.tenTuyen || 'N/A'}</strong>
            <p>Giờ khởi hành: {schedule.gioKhoiHanh}</p>
            <p>Xe bus: {schedule.xeBuyt?.bienSo || 'N/A'}</p>
            <p>Trạng thái: {schedule.trangThai}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="driver-container">
      <header className="driver-header">
        <h1>🚌 Bảng điều khiển tài xế</h1>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </header>

      <main className="driver-main">
        <div className="driver-card">
          <h2>📅 Lịch làm việc hôm nay</h2>
          {renderScheduleContent()}
        </div>

        <div className="driver-card">
          <h2>👧 Danh sách học sinh</h2>
          <p>Chức năng sẽ được cập nhật...</p>
        </div>

        <div className="driver-card actions-card">
          <h2>🚦 Chức năng</h2>
          <button className="driver-btn action-btn">Bắt đầu chuyến đi</button>
          <button className="driver-btn incident-btn" onClick={handleIncidentReport}>
            🚨 Gửi cảnh báo sự cố
          </button>
        </div>
      </main>
    </div>
  );
}