import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../style/SchoolTracking.css";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SchoolTracking() {
  const navigate = useNavigate();
  const [selectedBus, setSelectedBus] = useState(null);
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tạo icon xe buýt tùy chỉnh
  const createBusIcon = (status, heading = 0) => {
    const color = status === 'moving' ? '#22c55e' : '#f59e0b';
    return L.divIcon({
      html: `
        <div style="transform: rotate(${heading}deg); transition: transform 0.3s ease;">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="20" height="16" rx="3" fill="${color}" stroke="white" stroke-width="2"/>
            <rect x="8" y="10" width="4" height="3" fill="white" opacity="0.8"/>
            <rect x="14" y="10" width="4" height="3" fill="white" opacity="0.8"/>
            <rect x="20" y="10" width="4" height="3" fill="white" opacity="0.8"/>
            <circle cx="10" cy="20" r="2" fill="#333"/>
            <circle cx="22" cy="20" r="2" fill="#333"/>
            <polygon points="16,6 18,8 14,8" fill="${color}"/>
          </svg>
        </div>
      `,
      className: 'custom-bus-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  // Fetch tracking data from OSRM API
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const routeConfigs = [
          {
            id: "A1",
            name: "Tuyến A1",
            description: "Khu vực Đông - Trung tâm",
            color: "#22c55e",
            busId: "29B-12345",
            driver: "Nguyễn Văn An",
            coordinates: [
              [10.762622, 106.660172],
              [10.7685, 106.6825],
              [10.776889, 106.700806]
            ]
          },
          {
            id: "B2",
            name: "Tuyến B2", 
            description: "Khu vực Tây - Trung tâm",
            color: "#f59e0b",
            busId: "29B-67890",
            driver: "Lê Văn Bình",
            coordinates: [
              [10.762622, 106.660172],
              [10.7565, 106.6705],
              [10.7685, 106.6825],
              [10.776889, 106.700806]
            ]
          },
          {
            id: "C3",
            name: "Tuyến C3",
            description: "Khu vực Nam - Trung tâm", 
            color: "#3b82f6",
            busId: "29B-11111",
            driver: "Trần Văn Cường",
            coordinates: [
              [10.762622, 106.660172],
              [10.7585, 106.6705],
              [10.7645, 106.6805],
              [10.7705, 106.6905],
              [10.776889, 106.700806]
            ]
          }
        ];

        const trackingPromises = routeConfigs.map(async (config) => {
          try {
            const coordString = config.coordinates
              .map(coord => `${coord[1]},${coord[0]}`)
              .join(';');

            const res = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
            );
            
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            
            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const currentCoordIndex = Math.floor(Math.random() * config.coordinates.length);
              const currentCoord = config.coordinates[currentCoordIndex];
              const status = Math.random() > 0.3 ? "moving" : "stopped";
              
              return {
                busId: config.busId,
                route: config.id,
                driver: config.driver,
                currentLocation: `${config.description}`,
                status: status,
                statusText: status === "moving" ? "Đang di chuyển" : "Đang dừng",
                speed: status === "moving" ? `${Math.floor(Math.random() * 40 + 20)} km/h` : "0 km/h",
                nextStop: currentCoordIndex < config.coordinates.length - 1 ? "Điểm dừng tiếp theo" : "Điểm cuối",
                eta: `${Math.floor(Math.random() * 15 + 5)} phút`,
                students: Math.floor(Math.random() * 35 + 15),
                coordinates: currentCoord,
                heading: Math.floor(Math.random() * 360),
                distance: Math.round(route.distance / 1000),
                duration: Math.round(route.duration / 60),
                color: config.color
              };
            } else {
              throw new Error("Không có tuyến đường trong response");
            }
          } catch (err) {
            console.error(`Lỗi khi tải tracking cho ${config.name}:`, err);
            const currentCoord = config.coordinates[0];
            const status = Math.random() > 0.5 ? "moving" : "stopped";
            
            return {
              busId: config.busId,
              route: config.id,
              driver: config.driver,
              currentLocation: `${config.description}`,
              status: status,
              statusText: status === "moving" ? "Đang di chuyển" : "Đang dừng",
              speed: status === "moving" ? `${Math.floor(Math.random() * 40 + 20)} km/h` : "0 km/h",
              nextStop: "Điểm dừng tiếp theo",
              eta: `${Math.floor(Math.random() * 15 + 5)} phút`,
              students: Math.floor(Math.random() * 35 + 15),
              coordinates: currentCoord,
              heading: Math.floor(Math.random() * 360),
              distance: Math.floor(Math.random() * 10 + 5),
              duration: Math.floor(Math.random() * 30 + 15),
              color: config.color
            };
          }
        });

        const fetchedTracking = await Promise.all(trackingPromises);
        setTrackingData(fetchedTracking);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu tracking:", err);
        setError("Không thể tải dữ liệu tracking từ OSRM API. Vui lòng thử lại sau.");
        
        const fallbackTracking = [
          {
            busId: "29B-12345",
            route: "A1",
            driver: "Nguyễn Văn An",
            currentLocation: "Khu vực Đông - Trung tâm",
            status: "moving",
            statusText: "Đang di chuyển",
            speed: "35 km/h",
            nextStop: "Trường THCS Nguyễn Du",
            eta: "5 phút",
            students: 32,
            coordinates: [10.762622, 106.660172],
            heading: 45,
            distance: 5,
            duration: 15,
            color: "#22c55e"
          }
        ];
        setTrackingData(fallbackTracking);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleTrackBus = (busId) => {
    setSelectedBus(busId);
  };

  if (loading) {
    return (
      <div className="school-tracking-container">
        <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <div className="loading-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <h3>Đang tải dữ liệu tracking...</h3>
          <p>Đang cập nhật dữ liệu từ OSRM API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="school-tracking-container">
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
        <button className="nav-item" onClick={() => handleNavigation('/school/buses')}>
          🚌 Xe buýt
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/routes')}>
          🗺️ Tuyến đường
        </button>
        <button className="nav-item active" onClick={() => handleNavigation('/school/tracking')}>
          📍 Theo dõi
        </button>
        <button className="nav-item notification" onClick={() => handleNavigation('/school/notifications')}>
          🔔 Tin nhắn <span className="badge">5</span>
        </button>
      </nav>

      <main className="tracking-main">
        <div className="tracking-header">
          <h2>📍 Theo dõi xe buýt</h2>
          <p>Vị trí thời gian thực của các xe buýt trường học (Powered by OSRM API)</p>
          {error && (
            <div className="error-message" style={{ 
              color: '#dc2626', 
              backgroundColor: '#fee2e2', 
              padding: '10px', 
              borderRadius: '4px', 
              margin: '10px 0',
              border: '1px solid #fecaca'
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="tracking-content" style={{ display: 'flex', gap: '20px', height: '600px' }}>
          <div className="tracking-map" style={{ flex: '2' }}>
            <h3>🗺️ Bản đồ theo dõi</h3>
            <div className="map-container" style={{ height: '500px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <MapContainer 
                center={[10.762622, 106.660172]} 
                zoom={13} 
                scrollWheelZoom 
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {trackingData.map((bus) => (
                  <Marker 
                    key={bus.busId}
                    position={bus.coordinates}
                    icon={createBusIcon(bus.status, bus.heading)}
                  >
                    <Popup>
                      <div style={{ padding: '12px', minWidth: '200px' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '16px' }}>{bus.busId}</h4>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Tuyến:</strong> {bus.route}
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Tài xế:</strong> {bus.driver}
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Vị trí:</strong> {bus.currentLocation}
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Tốc độ:</strong> <span style={{ color: '#059669' }}>{bus.speed}</span>
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Học sinh:</strong> <span style={{ color: '#7c3aed' }}>{bus.students} em</span>
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <strong>Trạng thái:</strong> 
                          <span style={{ color: bus.status === 'moving' ? '#166534' : '#92400e' }}>
                            {bus.status === 'moving' ? '🟢' : '🟡'} {bus.statusText}
                          </span>
                        </div>
                        {bus.distance > 0 && (
                          <>
                            <div style={{ marginBottom: '6px' }}>
                              <strong>Khoảng cách:</strong> <span style={{ color: '#6366f1' }}>{bus.distance}km</span>
                            </div>
                            <div style={{ marginBottom: '6px' }}>
                              <strong>Thời gian di chuyển:</strong> <span style={{ color: '#6366f1' }}>{bus.duration} phút</span>
                            </div>
                          </>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="map-legend" style={{ 
              marginTop: '10px', 
              display: 'flex', 
              gap: '20px', 
              padding: '10px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: '#22c55e',
                  display: 'inline-block'
                }}></span>
                <span>Đang di chuyển</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: '#f59e0b',
                  display: 'inline-block'
                }}></span>
                <span>Đang dừng</span>
              </div>
            </div>
          </div>

          <div className="tracking-list" style={{ flex: '1', maxWidth: '350px' }}>
            <h3>🚌 Danh sách xe buýt</h3>
            <div className="bus-tracking-items" style={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {trackingData.map((bus) => (
                <div 
                  key={bus.busId} 
                  className={`tracking-item ${bus.status} ${selectedBus === bus.busId ? 'selected' : ''}`}
                  style={{
                    padding: '15px',
                    margin: '10px 0',
                    border: `2px solid ${selectedBus === bus.busId ? bus.color : '#e2e8f0'}`,
                    borderRadius: '8px',
                    backgroundColor: selectedBus === bus.busId ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleTrackBus(bus.busId)}
                >
                  <div className="tracking-header-item" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <h4 style={{ margin: 0, color: '#1e293b' }}>{bus.busId}</h4>
                    <span className={`status-indicator ${bus.status}`} style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: bus.status === 'moving' ? '#dcfce7' : '#fef3c7',
                      color: bus.status === 'moving' ? '#166534' : '#92400e'
                    }}>
                      {bus.status === 'moving' ? '🟢' : '🟡'} {bus.statusText}
                    </span>
                  </div>
                  
                  <div className="tracking-details" style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Tuyến:</span>
                      <span style={{ fontWeight: '500', color: '#1e293b' }}>{bus.route}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Tài xế:</span>
                      <span style={{ fontWeight: '500', color: '#1e293b' }}>{bus.driver}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Vị trí:</span>
                      <span style={{ fontWeight: '500', color: '#1e293b', fontSize: '12px', textAlign: 'right' }}>{bus.currentLocation}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Tốc độ:</span>
                      <span style={{ fontWeight: '500', color: '#059669' }}>{bus.speed}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Điểm đến:</span>
                      <span style={{ fontWeight: '500', color: '#1e293b', fontSize: '12px' }}>{bus.nextStop}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>ETA:</span>
                      <span style={{ fontWeight: '500', color: '#f59e0b' }}>{bus.eta}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Học sinh:</span>
                      <span style={{ fontWeight: '500', color: '#7c3aed' }}>{bus.students} em</span>
                    </div>
                    {bus.distance > 0 && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#64748b' }}>Khoảng cách:</span>
                          <span style={{ fontWeight: '500', color: '#6366f1' }}>{bus.distance}km</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#64748b' }}>Thời gian:</span>
                          <span style={{ fontWeight: '500', color: '#6366f1' }}>{bus.duration} phút</span>
                        </div>
                      </>
                    )}
                  </div>

                  <button 
                    className="track-btn"
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      padding: '8px',
                      backgroundColor: bus.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    📍 Theo dõi chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}