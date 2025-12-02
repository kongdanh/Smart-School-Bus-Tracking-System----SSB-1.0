import React, { useState, useEffect, useRef } from "react";
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
  const mapRef = useRef(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Chọn lịch trình đầu tiên khi load xong
  useEffect(() => {
    if (!loading && schedules.length > 0 && !selectedRoute) {
      setSelectedRoute(schedules[0]);
    }
  }, [loading, schedules, selectedRoute]);

  // Fit map bounds when route changes
  useEffect(() => {
    if (selectedRoute && selectedRoute.stops && selectedRoute.stops.length > 0 && mapRef.current) {
      const validStops = selectedRoute.stops.filter(stop =>
        stop.vido && stop.kinhdo &&
        !isNaN(parseFloat(stop.vido)) && !isNaN(parseFloat(stop.kinhdo))
      );

      if (validStops.length > 0) {
        const bounds = L.latLngBounds(
          validStops.map(stop => [parseFloat(stop.vido), parseFloat(stop.kinhdo)])
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedRoute]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getAllSchedules?.();

      if (response?.success) {
        const schedulesList = response.data || [];

        // Map schedules to route format
        const routes = schedulesList.map((schedule, idx) => ({
          id: schedule.lichTrinhId || schedule.id || `schedule-${idx}`,
          lichTrinhId: schedule.lichTrinhId,
          name: `Lịch trình ${schedule.lichTrinhId || idx + 1}`,
          status: schedule.trangThai || 'stopped',
          statusText: schedule.trangThai === 'active' ? 'Đang hoạt động' : 'Dừng',
          stops: schedule.tuyenduong?.diemDung || [],
          students: schedule.studentTrips?.map(st => st.hocsinh) || [],
          gioKhoiHanh: schedule.gioKhoiHanh,
          gioKetThuc: schedule.gioKetThuc,
          xeBuyt: schedule.xebuyt,
          taiXe: schedule.taixe,
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
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="school-routes-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Đang tải lịch trình...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="school-routes-container">
      {/* Header */}
      <div className="routes-header">
        <div className="header-content">
          <h1>Quản Lý Lịch Trình</h1>
          <p className="routes-subtitle">Xem và quản lý lịch trình với bản đồ thời gian thực</p>
        </div>
        <div className="header-actions">
          <button className="btn-add" onClick={() => navigate('/school/add-route')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tạo Tuyến Mới
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
            placeholder="Tìm kiếm lịch trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Layout: Sidebar + Map */}
      <div className="routes-content">
        {/* Left Sidebar - Schedule List */}
        <div className="routes-sidebar">
          <div className="sidebar-header">
            <h3>Danh Sách Lịch Trình ({filteredRoutes.length})</h3>
          </div>
          <div className="route-items">
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`route-item ${selectedRoute?.id === route.id ? 'active' : ''}`}
                  onClick={() => handleViewSchedule(route)}
                >
                  <div className="route-item-content">
                    <div className="route-item-title">#{route.lichTrinhId || route.id}</div>
                    <div className="route-item-time">
                      {route.gioKhoiHanh} - {route.gioKetThuc}
                    </div>
                    <div className="route-item-bus">
                      🚌 {route.xeBuyt?.bienSoXe || 'N/A'}
                    </div>
                    <div className="route-item-driver">
                      👤 {route.taiXe?.hoTen || 'N/A'}
                    </div>
                    <div className="route-item-stops">
                      📍 {route.stops?.length || 0} điểm dừng
                    </div>
                    <div className={`route-item-status ${route.status}`}>
                      <span className="status-dot"></span>
                      {route.statusText}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-routes">Không có lịch trình nào</div>
            )}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="routes-map-section">
          {selectedRoute ? (
            <>
              <div className="map-header">
                <h3>Tuyến Đường Lịch Trình #{selectedRoute.lichTrinhId || selectedRoute.id}</h3>
              </div>
              <MapContainer
                ref={mapRef}
                center={[10.8231, 106.6297]}
                zoom={12}
                className="route-map"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                {/* Draw polyline through stops with coordinates */}
                {selectedRoute.stops &&
                  selectedRoute.stops.filter(stop => stop.vido && stop.kinhdo).length > 1 && (
                    <Polyline
                      positions={selectedRoute.stops
                        .filter(stop => stop.vido && stop.kinhdo)
                        .map(stop => [parseFloat(stop.vido), parseFloat(stop.kinhdo)])}
                      color="#e94560"
                      weight={3}
                      opacity={0.8}
                    />
                  )}

                {/* Markers for all stops (with or without coordinates) */}
                {selectedRoute.stops &&
                  selectedRoute.stops.map((stop, idx) => {
                    // Nếu có toạ độ thì hiển thị marker trên map
                    if (stop.vido && stop.kinhdo) {
                      const lat = parseFloat(stop.vido);
                      const lng = parseFloat(stop.kinhdo);
                      if (!isNaN(lat) && !isNaN(lng)) {
                        return (
                          <Marker key={idx} position={[lat, lng]}>
                            <Popup>
                              <div style={{ fontSize: '12px' }}>
                                <strong>#{idx + 1}. {stop.tenDiemDung}</strong>
                                <p style={{ margin: '4px 0', color: '#666' }}>{stop.diaChi}</p>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      }
                    }
                    return null;
                  })}

                {/* Display stops info in a sidebar inside map if no coordinates */}
                {selectedRoute.stops &&
                  selectedRoute.stops.filter(s => !s.vido || !s.kinhdo).length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.8)',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        maxWidth: '200px',
                        zIndex: 400,
                      }}
                    >
                      <strong style={{ display: 'block', marginBottom: '8px' }}>
                        ⚠️ Điểm dừng chưa có toạ độ:
                      </strong>
                      {selectedRoute.stops
                        .filter(s => !s.vido || !s.kinhdo)
                        .map((stop, idx) => (
                          <div key={idx} style={{ marginBottom: '4px' }}>
                            #{idx + 1}. {stop.tenDiemDung}
                          </div>
                        ))}
                    </div>
                  )}
              </MapContainer>
            </>
          ) : (
            <div className="map-empty">
              <div className="empty-message">
                <p>Đang tải dữ liệu lịch trình...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}