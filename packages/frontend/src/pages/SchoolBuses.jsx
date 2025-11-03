import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SchoolBuses.css";

export default function SchoolBuses() {
  const navigate = useNavigate();

  const [buses] = useState([
    {
      id: "29B-12345",
      route: "A1",
      driver: "Nguyễn Văn An",
      capacity: 45,
      currentStudents: 32,
      status: "active",
      statusText: "Hoạt động"
    },
    {
      id: "29B-67890",
      route: "B2",
      driver: "Lê Văn Bình",
      capacity: 40,
      currentStudents: 0,
      status: "stopped",
      statusText: "Tạm dừng"
    },
    {
      id: "29B-11111",
      route: "C3",
      driver: "Trần Văn Cường",
      capacity: 50,
      currentStudents: 28,
      status: "active",
      statusText: "Hoạt động"
    }
  ]);

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

  const handleViewDetails = (busId) => {
    console.log("Xem chi tiết xe buýt:", busId);
  };

  const handleEditBus = (busId) => {
    console.log("Chỉnh sửa xe buýt:", busId);
  };

  return (
    <div className="school-buses-container">
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
        <button className="nav-item active" onClick={() => handleNavigation('/school/buses')}>
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

      <main className="buses-main">
        <div className="buses-header">
          <h2>🚌 Danh sách xe buýt</h2>
          <p>Thông tin xe buýt và tuyến đường được phân công</p>
        </div>

        <div className="buses-grid">
          {buses.map((bus) => (
            <div key={bus.id} className={`bus-card ${bus.status}`}>
              <div className="bus-header">
                <h3 className="bus-id">{bus.id}</h3>
                <span className={`status-badge ${bus.status}`}>
                  {bus.status === 'active' ? '● Hoạt động' : '● Tạm dừng'}
                </span>
              </div>

              <div className="bus-info">
                <div className="info-row">
                  <span className="label">Tuyến đường:</span>
                  <span className="value">{bus.route}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tài xế:</span>
                  <span className="value">{bus.driver}</span>
                </div>
                <div className="info-row">
                  <span className="label">Sức chứa:</span>
                  <span className="value">{bus.capacity} chỗ</span>
                </div>
                <div className="info-row">
                  <span className="label">Hiện tại:</span>
                  <span className="value student-count">
                    {bus.currentStudents}/{bus.capacity} học sinh
                  </span>
                </div>
              </div>

              <div className="bus-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleViewDetails(bus.id)}
                >
                  📍 Vị trí
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleEditBus(bus.id)}
                >
                  📝 Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}