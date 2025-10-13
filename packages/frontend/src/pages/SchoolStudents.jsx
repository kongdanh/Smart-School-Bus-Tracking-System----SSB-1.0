import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SchoolStudents.css";
import "../style/SchoolDashboard.css";

export default function SchoolStudents() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [routeFilter, setRouteFilter] = useState("");
  
  const [students] = useState([
    {
      id: "HS001",
      name: "Nguyễn Văn An",
      avatar: "NV",
      class: "10A1",
      busNumber: "29B-12345",
      route: "Tuyến A1",
      status: "Đã đón",
      statusColor: "success"
    },
    {
      id: "HS002", 
      name: "Lê Thị Bình",
      avatar: "LT",
      class: "10A2",
      busNumber: "29B-67890",
      route: "Tuyến B2",
      status: "Đang đón",
      statusColor: "warning"
    },
    {
      id: "HS003",
      name: "Trần Văn Cường", 
      avatar: "TC",
      class: "11B1",
      busNumber: "29B-11111",
      route: "Tuyến C3",
      status: "Trên xe",
      statusColor: "info"
    }
  ]);

  const [pagination] = useState({
    currentPage: 1,
    totalPages: 5,
    totalStudents: 1247
  });

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (classFilter === "" || student.class === classFilter) &&
      (routeFilter === "" || student.route === routeFilter)
    );
  });

  return (
    <div className="school-students-container">
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
        <button className="nav-item active" onClick={() => handleNavigation('/school/students')}>
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
        <button className="nav-item notification" onClick={() => handleNavigation('/school/notifications')}>
          🔔 Tin nhắn <span className="badge">5</span>
        </button>
      </nav>

      <main className="students-main">
        <div className="students-header">
          <h2>👥 Danh sách học sinh</h2>
          <p>Quản lý thông tin học sinh sử dụng dịch vụ xe buýt</p>
        </div>

        <div className="students-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select 
              value={classFilter} 
              onChange={(e) => setClassFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả lớp</option>
              <option value="10A1">10A1</option>
              <option value="10A2">10A2</option>
              <option value="11B1">11B1</option>
            </select>
            <select 
              value={routeFilter} 
              onChange={(e) => setRouteFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả tuyến</option>
              <option value="Tuyến A1">Tuyến A1</option>
              <option value="Tuyến B2">Tuyến B2</option>
              <option value="Tuyến C3">Tuyến C3</option>
            </select>
          </div>
        </div>

        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>HỌC SINH</th>
                <th>LỚP</th>
                <th>XE BUÝT</th>
                <th>TUYẾN ĐƯỜNG</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">{student.avatar}</div>
                      <div className="student-details">
                        <div className="student-name">{student.name}</div>
                        <div className="student-id">ID: {student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="class-badge">{student.class}</span>
                  </td>
                  <td>
                    <span className="bus-number">{student.busNumber}</span>
                  </td>
                  <td>
                    <span className="route-name">{student.route}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${student.statusColor}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Hiển thị 1 đến 3 trong tổng số {pagination.totalStudents.toLocaleString()} học sinh
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn">Trước</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">...</button>
            <button className="pagination-btn">Sau</button>
          </div>
        </div>
      </main>
    </div>
  );
}