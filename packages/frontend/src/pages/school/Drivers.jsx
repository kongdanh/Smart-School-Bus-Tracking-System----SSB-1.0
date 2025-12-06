import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { exportDrivers } from '../../utils/exportUtils';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-drivers.css';

const Drivers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getAllDrivers();

      if (response.success) {
        setDrivers(response.data || []);
      } else {
        toast.warning("Không thể tải danh sách tài xế");
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error("Lỗi khi tải danh sách tài xế");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDriver = (driver) => {
    setEditingDriver({ ...driver });
    setShowEditModal(true);
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài xế này?')) return;

    try {
      const response = await schoolService.deleteDriver(driverId);
      if (response.success) {
        toast.success('Xóa tài xế thành công!');
        fetchDrivers();
      } else {
        toast.error(response.message || 'Không thể xóa tài xế');
      }
    } catch (error) {
      console.error('Delete driver error:', error);
      toast.error('Lỗi khi xóa tài xế');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingDriver.hoTen || !editingDriver.soDienThoai) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await schoolService.updateDriver(editingDriver.taiXeId, editingDriver);
      if (response.success) {
        toast.success('Cập nhật thông tin tài xế thành công!');
        setShowEditModal(false);
        setEditingDriver(null);
        fetchDrivers();
      } else {
        toast.error(response.message || 'Không thể cập nhật');
      }
    } catch (error) {
      console.error('Update driver error:', error);
      toast.error('Lỗi khi cập nhật thông tin tài xế');
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.soDienThoai.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || driver.trangThai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = drivers.filter(d => d.trangThai === 'active').length;
  const inactiveCount = drivers.filter(d => d.trangThai === 'inactive').length;
  const avgRating = (drivers.reduce((sum, d) => sum + d.gioHeBay, 0) / drivers.length).toFixed(1);

  return (
    <div className="school-drivers-container">
      {/* Header */}
      <div className="drivers-header">
        <div className="header-content">
          <h1>Drivers Management</h1>
          <p className="header-subtitle">Manage bus drivers and their performance</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/school/drivers/add')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Driver
        </button>
      </div>

      {/* Stats */}
      <div className="drivers-stats">
        <div className="stat-box total">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{drivers.length}</div>
            <div className="stat-label">Total Drivers</div>
          </div>
        </div>

        <div className="stat-box active">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{activeCount}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>

        <div className="stat-box inactive">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{inactiveCount}</div>
            <div className="stat-label">Off Duty</div>
          </div>
        </div>

        <div className="stat-box rating">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="drivers-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Off Duty</option>
          </select>

          <button className="btn btn-secondary" onClick={() => exportDrivers(filteredDrivers)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="drivers-grid">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map(driver => (
            <div key={driver.taiXeId} className={`driver-card ${driver.trangThai}`}>
              <div className="driver-header">
                <div className="driver-avatar-large">
                  {driver.avatar}
                </div>
                <span className={`status-badge ${driver.trangThai}`}>
                  <span className="status-dot"></span>
                  {driver.trangThai === 'active' ? 'Active' : 'Off Duty'}
                </span>
              </div>

              <div className="driver-info">
                <h3 className="driver-name">{driver.hoTen}</h3>
                <div className="driver-rating">
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{driver.gioHeBay.toFixed(1)}</span>
                  <span className="trips-count">({driver.soChuyenHT} trips)</span>
                </div>
              </div>

              <div className="driver-details">
                <div className="detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{driver.soDienThoai}</span>
                </div>
                <div className="detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>{driver.bienSoCapphep}</span>
                </div>
                <div className="detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span>{driver.busNumber}</span>
                </div>
                <div className="detail-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="6" cy="19" r="3" />
                    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                    <circle cx="18" cy="5" r="3" />
                  </svg>
                  <span>{driver.route}</span>
                </div>
              </div>

              <div className="driver-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => handleEditDriver(driver)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteDriver(driver.taiXeId)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p>No drivers found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {filteredDrivers.length} of {drivers.length} drivers
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingDriver && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Driver Information</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Driver Name *</label>
                <input
                  type="text"
                  value={editingDriver.hoTen || ''}
                  onChange={(e) => setEditingDriver({ ...editingDriver, hoTen: e.target.value })}
                  placeholder="Enter driver name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  value={editingDriver.soDienThoai || ''}
                  onChange={(e) => setEditingDriver({ ...editingDriver, soDienThoai: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  value={editingDriver.bangLai || ''}
                  onChange={(e) => setEditingDriver({ ...editingDriver, bangLai: e.target.value })}
                  placeholder="Enter license number"
                />
              </div>
              <div className="form-group">
                <label>Experience (years)</label>
                <input
                  type="number"
                  value={editingDriver.kinhNghiem || ''}
                  onChange={(e) => setEditingDriver({ ...editingDriver, kinhNghiem: parseInt(e.target.value) })}
                  placeholder="Years of experience"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingDriver.trangThai || 'active'}
                  onChange={(e) => setEditingDriver({ ...editingDriver, trangThai: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;