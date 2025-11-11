// frontend/src/pages/SchoolDrivers.jsx
import React, { useState, useEffect } from "react"; // ✅ Thêm useEffect
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Thêm toast
import authService from "../services/authService"; // ✅ Thêm authService
import "../style/SchoolDrivers.css";
import "../style/SchoolDashboard.css";

export default function SchoolDrivers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [drivers] = useState([
    {
      id: "TX001",
      name: "Nguyễn Văn Minh",
      avatar: "NM",
      phone: "0901234567",
      busNumber: "29B-12345",
      route: "Tuyến A1",
      status: "Đang lái",
      statusColor: "success",
      experience: "5 năm"
    },
    {
      id: "TX002",
      name: "Trần Thị Lan",
      avatar: "TL",
      phone: "0912345678",
      busNumber: "29B-67890",
      route: "Tuyến B2",
      status: "Nghỉ phép",
      statusColor: "warning",
      experience: "3 năm"
    },
    {
      id: "TX003",
      name: "Lê Văn Hùng",
      avatar: "LH",
      phone: "0923456789",
      busNumber: "29B-11111",
      route: "Tuyến C3",
      status: "Sẵn sàng",
      statusColor: "info",
      experience: "7 năm"
    },
    {
      id: "TX004",
      name: "Phạm Văn Tài",
      avatar: "PT",
      phone: "0934567890",
      busNumber: "29B-22222",
      route: "Tuyến D4",
      status: "Đang lái",
      statusColor: "success",
      experience: "4 năm"
    }
  ]);

  // ✅ useEffect để hiển thị toast chào mừng
  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") === "true") {
      localStorage.removeItem("justLoggedIn");

      const user = authService.getCurrentUser();
      const userName = user?.hoTen || user?.name || user?.email || "bạn";

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

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="school-drivers-container">
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
            🚪 Đăng xuất
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
        <button className="nav-item active" onClick={() => handleNavigation('/school/drivers')}>
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
        <button className="nav-item notification" onClick={() => handleNavigation('/school/notifications')}>
          🔔 Tin nhắn <span className="badge">5</span>
        </button>
      </nav>

      <main className="drivers-main">
        <div className="drivers-header">
          <h2>🚗 Quản lý tài xế</h2>
          <p>Thông tin và trạng thái các tài xế xe buýt</p>
        </div>

        <div className="drivers-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm tài xế theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">📋 Tất cả trạng thái</option>
              <option value="Đang lái">🚗 Đang lái</option>
              <option value="Sẵn sàng">✅ Sẵn sàng</option>
              <option value="Nghỉ phép">⏸️ Nghỉ phép</option>
            </select>
          </div>
        </div>

        <div className="drivers-summary">
          <div className="summary-item">
            <span className="summary-label">Tổng tài xế:</span>
            <span className="summary-value">{drivers.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Đang hoạt động:</span>
            <span className="summary-value success">
              {drivers.filter(d => d.status === "Đang lái").length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Kết quả tìm kiếm:</span>
            <span className="summary-value">{filteredDrivers.length}</span>
          </div>
        </div>

        {filteredDrivers.length === 0 ? (
          <div className="no-results">
            <p>😔 Không tìm thấy tài xế nào phù hợp</p>
          </div>
        ) : (
          <div className="drivers-table-container">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>TÀI XẾ</th>
                  <th>SỐ ĐIỆN THOẠI</th>
                  <th>XE BUÝT</th>
                  <th>TUYẾN ĐƯỜNG</th>
                  <th>KINH NGHIỆM</th>
                  <th>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id}>
                    <td>
                      <div className="driver-info">
                        <div className="driver-avatar">{driver.avatar}</div>
                        <div className="driver-details">
                          <div className="driver-name">{driver.name}</div>
                          <div className="driver-id">ID: {driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="phone-number">📱 {driver.phone}</span>
                    </td>
                    <td>
                      <span className="bus-number">🚌 {driver.busNumber}</span>
                    </td>
                    <td>
                      <span className="route-name">🗺️ {driver.route}</span>
                    </td>
                    <td>
                      <span className="experience">⏱️ {driver.experience}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${driver.statusColor}`}>
                        {driver.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}