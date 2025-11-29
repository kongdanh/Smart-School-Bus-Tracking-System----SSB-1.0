import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import parentService from '../../services/parentService';
import '../../styles/parent-styles/parent-dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (children.length === 0) setLoading(true);

      const response = await parentService.getMyChildren();

      if (response.success && Array.isArray(response.data)) {
        const safeChildrenData = response.data.map(child => ({
          id: child.id || child.hocSinhId,
          name: child.name || child.hoTen || "Chưa cập nhật tên",
          class: child.class || child.lop || "N/A",
          status: child.status || 'home',
          statusText: getStatusText(child.status),
          location: child.location || child.diemDon || 'Nhà riêng',
          lastUpdate: 'Vừa cập nhật'
        }));
        setChildren(safeChildrenData);
      } else {
        setChildren([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'on-bus': 'Đang trên xe',
      'waiting': 'Đang chờ xe',
      'arrived': 'Đã đến nơi',
      'home': 'Chưa có lịch'
    };
    return statusMap[status] || 'Chưa có lịch';
  };

  if (loading) return <div className="dashboard"><div className="loading-container"><div className="spinner"></div><p>Đang tải thông tin...</p></div></div>;
  if (error) return <div className="dashboard"><div className="error-container"><p>{error}</p><button onClick={fetchDashboardData}>Thử lại</button></div></div>;

  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Xin chào!</h1>
            <p>Theo dõi hành trình đến trường của con</p>
          </div>
          <div className="welcome-date">
            <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>
      </section>

      <section className="children-section">
        <div className="section-header">
          <h2>Danh sách học sinh</h2>
          <span className="badge">{children.length} học sinh</span>
        </div>

        {children.length === 0 ? (
          <div className="empty-state"><p>Chưa có dữ liệu học sinh.</p></div>
        ) : (
          <div className="children-grid">
            {children.map(child => (
              <div
                key={child.id}
                className="child-card"
                // --- SỬA ĐỔI QUAN TRỌNG: Gửi ID qua state ---
                onClick={() => navigate('/parent/tracking', { state: { studentId: child.id } })}
              >
                <div className="child-header">
                  <div className="child-avatar">
                    {child.name ? child.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="child-info">
                    <h3>{child.name}</h3>
                    <p className="child-class">Lớp: {child.class}</p>
                  </div>
                </div>

                <div className={`child-status status-${child.status}`}>
                  <span className="status-dot"></span>
                  {child.statusText}
                </div>

                <div className="child-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{child.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;