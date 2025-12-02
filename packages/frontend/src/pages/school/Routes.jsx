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
  const [showRoutesModal, setShowRoutesModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getAllSchedules?.();
      
      if (response?.success) {
        const schedulesList = response.data || [];
        
        // Map schedules to route format
        const routes = schedulesList.map((schedule, idx) => ({
          id: schedule.lichTrinhId || schedule.id || `schedule-${idx}`,
          name: schedule.tenTuyen || `Lịch trình ${idx + 1}`,
          description: `Tuyến: ${schedule.tenTuyen || 'N/A'}`,
          color: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'][idx % 5],
          stops: schedule.stops?.length || 0,
          status: 'stopped',
          statusText: 'Stopped',
          students: schedule.students?.length || 0,
          buses: 1,
          distance: 0,
          duration: 0,
          routeCoordinates: [],
          stopCoordinates: [],
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
        {/* Routes List */}
        <div className="routes-list">
          <h3>All Routes ({filteredRoutes.length})</h3>
          <div className="route-items">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className={`route-item ${route.status} ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                onClick={() => handleViewSchedule(route)}
              >
                <div className="route-item-header">
                  <div className="route-color" style={{ backgroundColor: route.color }}></div>
                  <div className="route-info">
                    <h4>{route.name}</h4>
                    <p>{route.description}</p>
                  </div>
                </div>

                <div className="route-stats">
                  <div className="route-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{route.stops} stops</span>
                  </div>
                  <div className="route-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{route.students} students</span>
                  </div>
                </div>

                {route.distance > 0 && (
                  <div className="route-details">
                    <span>📏 {route.distance}km</span>
                    <span>⏱️ {route.duration} mins</span>
                    <span className={`status-badge ${route.status}`}>
                      <span className="status-dot"></span>
                      {route.statusText}
                    </span>
                  </div>
                )}
                {!route.distance && (
                  <div className="route-details">
                    <span className={`status-badge ${route.status}`}>
                      <span className="status-dot"></span>
                      {route.statusText}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="route-map-container">
          <div className="map-header">
            <h3>Route Map</h3>
            {selectedRoute && (
              <div className="selected-route-info">
                <div className="route-color-indicator" style={{ backgroundColor: selectedRoute.color }}></div>
                <span>{selectedRoute.name}</span>
              </div>
            )}
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={[10.762622, 106.660172]}
              zoom={12}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {schedules.map((route) => (
                <React.Fragment key={route.id}>
                  {route.routeCoordinates && route.routeCoordinates.length > 0 && (
                    <Polyline
                      positions={route.routeCoordinates}
                      pathOptions={{
                        color: selectedRoute?.id === route.id ? route.color : '#cccccc',
                        weight: selectedRoute?.id === route.id ? 5 : 3,
                        opacity: selectedRoute?.id === route.id ? 1 : 0.5
                      }}
                    />
                  )}

                  {route.stopCoordinates && route.stopCoordinates.map((coord, stopIndex) => (
                    <Marker
                      key={`${route.id}-stop-${stopIndex}`}
                      position={coord}
                      icon={createIcon(route.color, stopIndex + 1)}
                    >
                      <Popup>
                        <div className="map-popup">
                          <h4>{route.name}</h4>
                          <p>Stop {stopIndex + 1}</p>
                          <div className="popup-info">
                            <span>Status: {route.statusText}</span>
                            {route.distance > 0 && (
                              <span>{route.distance}km • {route.duration} mins</span>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Schedule Details Modal */}
      {showRoutesModal && selectedRoute && (
        <div className="modal-overlay" onClick={() => setShowRoutesModal(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRoute.name}</h2>
              <button className="modal-close" onClick={() => setShowRoutesModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="schedule-details">
                <div className="detail-section">
                  <h3>Thông Tin Tuyến</h3>
                  <p><strong>Mã:</strong> {selectedRoute.id}</p>
                  <p><strong>Trạng thái:</strong> <span className={`status-badge ${selectedRoute.status}`}>{selectedRoute.statusText}</span></p>
                  <p><strong>Số điểm dừng:</strong> {selectedRoute.stops}</p>
                  <p><strong>Số học sinh:</strong> {selectedRoute.students}</p>
                  <p><strong>Số xe:</strong> {selectedRoute.buses}</p>
                </div>
                
                {selectedRoute.scheduleData?.stops && (
                  <div className="detail-section">
                    <h3>Các Điểm Dừng</h3>
                    <ul className="stops-list">
                      {selectedRoute.scheduleData.stops.map((stop, idx) => (
                        <li key={idx}>
                          <strong>{idx + 1}. {stop.tenDiemDung || `Điểm dừng ${idx + 1}`}</strong>
                          <p>{stop.diaChi}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}