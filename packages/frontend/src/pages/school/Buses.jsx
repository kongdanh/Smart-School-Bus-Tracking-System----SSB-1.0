import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { exportBuses } from '../../utils/exportUtils';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-buses.css';

const Buses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusRoutes, setSelectedBusRoutes] = useState(null);
  const [busRoutes, setBusRoutes] = useState([]);

  // Load dữ liệu từ API
  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getAllBuses();

      if (response.success) {
        setBuses(response.data || []);
      } else {
        toast.warning("Không thể tải danh sách xe");
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      toast.error("Lỗi khi tải danh sách xe");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackBus = async (bus) => {
    try {
      // Fetch schedules/routes for this bus
      const schedulesRes = await schoolService.getAllSchedules?.() || { success: false, data: [] };
      const allSchedules = schedulesRes.data || [];

      // Filter schedules for this bus
      const busSchedules = allSchedules.filter(s => s.xeBuytId === bus.id || s.bienSoXe === bus.bienSo);

      if (busSchedules.length === 0) {
        toast.info(`Xe ${bus.bienSo} không có lịch trình nào`);
      } else {
        toast.info(`Xe ${bus.bienSo} có ${busSchedules.length} lịch trình`);
      }

      setSelectedBusRoutes(bus.id);
      setBusRoutes(busSchedules);
    } catch (error) {
      console.error('Error fetching bus routes:', error);
      toast.error('Lỗi khi tải lịch trình');
    }
  };

  const filteredBuses = buses.filter(bus => {
    const matchesSearch = bus.maXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.bienSo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bus.trangThai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = buses.filter(b => b.trangThai === 'active').length;
  const maintenanceCount = buses.filter(b => b.trangThai === 'maintenance').length;
  const inactiveCount = buses.filter(b => b.trangThai === 'inactive').length;
  const totalCapacity = buses.reduce((sum, b) => sum + b.sucChua, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'maintenance': return 'maintenance';
      case 'inactive': return 'inactive';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'maintenance': return 'Maintenance';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="school-buses-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div className="spinner"></div>
          <p>Loading buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="school-buses-container">
      {/* Header */}
      <div className="buses-header">
        <div className="header-content">
          <h1>Buses Management</h1>
          <p className="header-subtitle">Manage school buses and maintenance schedules</p>
        </div>
        <button className="btn-add-bus" onClick={() => navigate('/school/buses/add')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Bus
        </button>
      </div>

      {/* Stats */}
      <div className="buses-stats">
        <div className="stat-box total">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{buses.length}</div>
            <div className="stat-label">Total Buses</div>
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

        <div className="stat-box maintenance">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{maintenanceCount}</div>
            <div className="stat-label">Maintenance</div>
          </div>
        </div>

        <div className="stat-box capacity">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalCapacity}</div>
            <div className="stat-label">Total Capacity</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="buses-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by bus ID or license plate..."
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
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn-export" onClick={() => exportBuses(filteredBuses)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Buses Grid */}
      <div className="buses-grid">
        {filteredBuses.length > 0 ? (
          filteredBuses.map(bus => (
            <div key={bus.xeBuytId} className={`bus-card ${getStatusColor(bus.trangThai)}`}>
              <div className="bus-card-header">
                <div className="bus-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <span className={`status-badge ${getStatusColor(bus.trangThai)}`}>
                  <span className="status-dot"></span>
                  {getStatusText(bus.trangThai)}
                </span>
              </div>

              <div className="bus-info-main">
                <h3 className="bus-id">{bus.maXe}</h3>
                <div className="bus-license">{bus.bienSo}</div>
              </div>

              <div className="bus-capacity">
                <div className="capacity-bar">
                  <div
                    className="capacity-fill"
                    style={{ width: `${(bus.currentStudents / bus.sucChua) * 100}%` }}
                  ></div>
                </div>
                <div className="capacity-text">
                  {bus.currentStudents}/{bus.sucChua} students
                </div>
              </div>

              <div className="bus-details">
                <div className="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{bus.driver}</span>
                </div>
                <div className="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="6" cy="19" r="3" />
                    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                    <circle cx="18" cy="5" r="3" />
                  </svg>
                  <span>{bus.route}</span>
                </div>
                <div className="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Year: {bus.namSanXuat}</span>
                </div>
                <div className="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  <span>Next: {new Date(bus.nextMaintenance).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bus-actions">
                <button className="btn-primary" onClick={() => handleTrackBus(bus)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Track
                </button>
                <button className="btn-secondary" onClick={() => navigate(`/school/buses/${bus.id}/edit`)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
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
            <p>No buses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buses;