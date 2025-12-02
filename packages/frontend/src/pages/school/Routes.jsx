import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import schoolService from "../../services/schoolService";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/school-styles/school-routes.css";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SchoolRoutes() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getAllSchedules?.();

      if (response?.success) {
        const schedulesList = response.data || [];

        // Map schedules to route format - chỉ lưu cần thiết
        const routes = schedulesList.map((schedule, idx) => ({
          id: schedule.lichTrinhId || schedule.id || `schedule-${idx}`,
          name: `Lịch trình ${schedule.lichTrinhId || schedule.id || idx + 1}`,
          status: 'stopped',
          statusText: 'Dừng',
          stops: schedule.stops || [],
          students: schedule.students || [],
          scheduleData: schedule
        }));

        setSchedules(routes);
      } else {
        toast.warning("Không thể tải lịch trình");
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = (route) => {
    setSelectedRoute(route);
  };

  const filteredRoutes = schedules.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="school-routes-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Loading routes...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="school-routes-container">
      {/* Header */}
      <div className="routes-header">
        <div className="header-content">
          <h1>Route Management</h1>
          <p className="routes-subtitle">View and manage bus routes with real-time data</p>
        </div>
        <div className="header-actions">
          <button className="btn-add" onClick={() => navigate('/school/add-route')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Route
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="routes-search">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="routes-content">
        {/* Routes List - Sidebar trái: chỉ hiển thị lichTrinhId và trạng thái */}
        <div className="routes-list">
          <h3>Lịch Trình ({filteredRoutes.length})</h3>
          <div className="route-items">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className={`route-item ${route.status} ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                onClick={() => handleViewSchedule(route)}
                style={{ cursor: 'pointer', padding: '12px', borderRadius: '8px', marginBottom: '8px', backgroundColor: selectedRoute?.id === route.id ? '#0f3460' : '#2a2a3e', border: '1px solid #444' }}
              >
                <div className="route-item-header">
                  <div className="route-info">
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>#{route.id}</h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#aaa' }}>
                      <span className={`status-badge ${route.status}`} style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: route.status === 'stopped' ? '#f59e0b' : '#10b981', fontSize: '11px' }}>
                        <span className="status-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white', marginRight: '4px' }}></span>
                        {route.statusText}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map - Hiển thị chi tiết của schedule được chọn */}
        <div className="route-map-container">
          <div className="map-header">
            <h3>Chi Tiết Lịch Trình</h3>
          </div>

          {selectedRoute ? (
            <div className="schedule-details-view" style={{ padding: '16px', backgroundColor: '#1a1a2e', borderRadius: '8px', overflow: 'auto', maxHeight: '600px' }}>
              <div className="detail-section" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #333' }}>
                <h3 style={{ marginTop: 0, marginBottom: '8px', color: '#e94560' }}>Thông Tin Cơ Bản</h3>
                <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Mã Lịch Trình:</strong> {selectedRoute.id}</p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Trạng Thái:</strong>
                  <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '4px', backgroundColor: selectedRoute.status === 'stopped' ? '#f59e0b' : '#10b981', color: 'white', fontSize: '12px' }}>
                    {selectedRoute.statusText}
                  </span>
                </p>
              </div>

              {selectedRoute.stops && selectedRoute.stops.length > 0 && (
                <div className="detail-section" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #333' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#e94560' }}>Các Điểm Dừng ({selectedRoute.stops.length})</h3>
                  <ul className="stops-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {selectedRoute.stops.map((stop, idx) => (
                      <li key={idx} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#0f3460', borderRadius: '6px', fontSize: '13px' }}>
                        <strong style={{ color: '#e94560' }}>#{idx + 1}. {stop.tenDiemDung || `Điểm dừng ${idx + 1}`}</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#aaa' }}>{stop.diaChi}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRoute.students && selectedRoute.students.length > 0 && (
                <div className="detail-section">
                  <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#e94560' }}>Học Sinh ({selectedRoute.students.length})</h3>
                  <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>Có {selectedRoute.students.length} học sinh trên lịch trình này</p>
                </div>
              )}
            </div>
          ) : (
            <div className="map-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#666' }}>
              <p>Chọn một lịch trình để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}