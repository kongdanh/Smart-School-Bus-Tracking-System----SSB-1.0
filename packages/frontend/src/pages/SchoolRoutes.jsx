import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../style/SchoolRoutes.css";

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
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tạo icons cho bản đồ
  const createIcon = (color, number) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
      className: 'custom-div-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Sử dụng OSRM API để tạo tuyến đường thực tế
  useEffect(() => {
    const fetchRoutesData = async () => {
      try {
        setLoading(true);

        const routeConfigs = [
          {
            id: "A1",
            name: "Tuyến A1",
            description: "Khu vực Đông - Trung tâm",
            color: "#22c55e",
            coordinates: [
              [10.762622, 106.660172], // Trường học
              [10.7685, 106.6825],     // Điểm dừng 1
              [10.776889, 106.700806]  // Nhà học sinh
            ]
          },
          {
            id: "B2",
            name: "Tuyến B2",
            description: "Khu vực Tây - Trung tâm",
            color: "#f59e0b",
            coordinates: [
              [10.762622, 106.660172], // Trường học
              [10.7565, 106.6705],     // Điểm dừng 1
              [10.7685, 106.6825],     // Điểm dừng 2
              [10.776889, 106.700806]  // Nhà học sinh
            ]
          },
          {
            id: "C3",
            name: "Tuyến C3",
            description: "Khu vực Nam - Trung tâm",
            color: "#3b82f6",
            coordinates: [
              [10.762622, 106.660172], // Trường học
              [10.7585, 106.6705],     // Điểm dừng 1
              [10.7645, 106.6805],     // Điểm dừng 2
              [10.7705, 106.6905],     // Điểm dừng 3
              [10.776889, 106.700806]  // Nhà học sinh
            ]
          }
        ];

        const routePromises = routeConfigs.map(async (config) => {
          try {
            // Tạo chuỗi tọa độ cho OSRM API
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
              const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

              return {
                ...config,
                stops: config.coordinates.length,
                status: Math.random() > 0.3 ? "active" : "stopped",
                statusText: Math.random() > 0.3 ? "Hoạt động" : "Tạm dừng",
                routeCoordinates: routeCoords,
                distance: Math.round(route.distance / 1000), // km
                duration: Math.round(route.duration / 60), // phút
                stopCoordinates: config.coordinates
              };
            } else {
              throw new Error("Không có tuyến đường trong response");
            }
          } catch (err) {
            console.error(`Lỗi khi tải tuyến ${config.name}:`, err);
            return {
              ...config,
              stops: config.coordinates.length,
              status: "error",
              statusText: "Lỗi kết nối",
              routeCoordinates: config.coordinates,
              stopCoordinates: config.coordinates,
              distance: 0,
              duration: 0
            };
          }
        });

        const fetchedRoutes = await Promise.all(routePromises);
        setRoutes(fetchedRoutes);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải tuyến đường:", err);
        setError("Không thể tải dữ liệu tuyến đường. Vui lòng thử lại sau.");

        // Fallback routes nếu API lỗi
        const fallbackRoutes = [
          {
            id: "A1",
            name: "Tuyến A1",
            description: "Khu vực Đông - Trung tâm",
            color: "#22c55e",
            stops: 3,
            status: "active",
            statusText: "Hoạt động",
            routeCoordinates: [[10.762622, 106.660172], [10.7685, 106.6825], [10.776889, 106.700806]],
            stopCoordinates: [[10.762622, 106.660172], [10.7685, 106.6825], [10.776889, 106.700806]],
            distance: 5,
            duration: 15
          }
        ];
        setRoutes(fallbackRoutes);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutesData();
  }, []);

  const handleLogout = () => {
    // Xóa token đăng nhập
    localStorage.removeItem("token");

    // (Tuỳ chọn) Xóa thêm thông tin người dùng nếu bạn có lưu
    // localStorage.removeItem("user");

    // Chuyển về trang login
    navigate("/");
  };


  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  if (loading) {
    return (
      <div className="school-routes-container">
        <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <div className="loading-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <h3>Đang tải tuyến đường...</h3>
          <p>Đang cập nhật dữ liệu từ OSRM API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="school-routes-container">
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
        <button className="nav-item active" onClick={() => handleNavigation('/school/routes')}>
          🗺️ Tuyến đường
        </button>
        <button className="nav-item" onClick={() => handleNavigation('/school/tracking')}>
          📍 Theo dõi
        </button>
        <button className="nav-item notification" onClick={() => handleNavigation('/school/notifications')}>
          🔔 Tin nhắn <span className="badge">5</span>
        </button>
      </nav>

      <main className="routes-main">
        <div className="routes-header">
          <h2>🗺️ Tuyến đường</h2>
          <p>Bản đồ và thông tin các tuyến đường xe buýt (Powered by OSRM API)</p>
          {error && <div className="error-message" style={{ color: 'red', padding: '10px', backgroundColor: '#fee', borderRadius: '4px', margin: '10px 0' }}>⚠️ {error}</div>}
        </div>

        <div className="routes-content" style={{ display: 'flex', gap: '20px', height: '600px' }}>
          <div className="routes-list" style={{ flex: '1', maxWidth: '300px' }}>
            <h3>📋 Danh sách tuyến</h3>
            <div className="route-items">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className={`route-item ${route.status} ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                  onClick={() => handleRouteSelect(route)}
                  style={{
                    padding: '15px',
                    margin: '10px 0',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedRoute?.id === route.id ? '#f0f9ff' : 'white'
                  }}
                >
                  <div className="route-info">
                    <h4 style={{ margin: '0 0 5px 0', color: route.color }}>{route.name}</h4>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>{route.description}</p>
                    <span className="stops-count" style={{ fontSize: '12px', color: '#888' }}>{route.stops} điểm dừng</span>
                    {route.distance > 0 && (
                      <div className="route-details" style={{ marginTop: '5px', fontSize: '12px', color: '#555' }}>
                        <span style={{ marginRight: '10px' }}>📏 {route.distance}km</span>
                        <span>⏱️ {route.duration} phút</span>
                      </div>
                    )}
                  </div>
                  <div className={`route-status ${route.status}`} style={{
                    marginTop: '10px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: route.status === 'active' ? '#dcfce7' : route.status === 'stopped' ? '#fef3c7' : '#fee2e2',
                    color: route.status === 'active' ? '#166534' : route.status === 'stopped' ? '#92400e' : '#991b1b'
                  }}>
                    {route.statusText}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="route-map" style={{ flex: '2' }}>
            <h3>🗺️ Bản đồ tuyến đường</h3>
            <div className="map-container" style={{ height: '500px', border: '1px solid #ddd', borderRadius: '8px' }}>
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

                {routes.map((route) => (
                  <React.Fragment key={route.id}>
                    {/* Vẽ tuyến đường */}
                    {route.routeCoordinates && route.routeCoordinates.length > 0 && (
                      <Polyline
                        positions={route.routeCoordinates}
                        pathOptions={{
                          color: selectedRoute?.id === route.id ? route.color : '#cccccc',
                          weight: selectedRoute?.id === route.id ? 6 : 3,
                          opacity: selectedRoute?.id === route.id ? 1 : 0.6
                        }}
                      />
                    )}

                    {/* Vẽ các điểm dừng */}
                    {route.stopCoordinates && route.stopCoordinates.map((coord, stopIndex) => (
                      <Marker
                        key={`${route.id}-stop-${stopIndex}`}
                        position={coord}
                        icon={createIcon(route.color, stopIndex + 1)}
                      >
                        <Popup>
                          <div style={{ padding: '8px' }}>
                            <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{route.name}</h4>
                            <p style={{ margin: '0', color: '#64748b' }}>Điểm dừng {stopIndex + 1}</p>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Trạng thái: {route.statusText}</p>
                            {route.distance > 0 && (
                              <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                                📏 {route.distance}km | ⏱️ {route.duration} phút
                              </p>
                            )}
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
      </main>
    </div>
  );
}