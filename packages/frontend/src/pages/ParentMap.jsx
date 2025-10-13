import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../style/ParentMap.css";
import busIconImg from "../assets/bus.svg";
import schoolIconImg from "../assets/school.svg";
import homeIconImg from "../assets/house.svg";
import L from "leaflet";

export default function ParentMap() {
    const [route, setRoute] = useState([]); // lưu tuyến đường
    const [busData, setBusData] = useState(null); // thông tin xe bus từ router API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 📍 Tạo hai điểm mẫu: trường học và nhà học sinh, bus
    const school = [10.762622, 106.660172];
    const home = [10.776889, 106.700806];
    const [busStop, setBusStop] = useState([10.7685, 106.6825]);

    // Icon cho map
    const busIcon = L.icon({
        iconUrl: busIconImg,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const schoolIcon = L.icon({
        iconUrl: schoolIconImg,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const homeIcon = L.icon({
        iconUrl: homeIconImg,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    // Sử dụng router API để lấy thông tin parent - giống như logic trong SchoolRoutes
    useEffect(() => {
        const fetchParentData = async () => {
            try {
                setLoading(true);
                
                // Sử dụng router API để tạo thông tin parent và bus
                const parentRouteConfig = {
                    id: "A1",
                    name: "Tuyến A1",
                    description: "Khu vực Đông - Trung tâm",
                    color: "#22c55e",
                    busId: "29B-12345",
                    driver: "Nguyễn Văn An",
                    studentName: "Nguyễn Văn A",
                    coordinates: [
                        [10.762622, 106.660172], // Trường học
                        [10.7685, 106.6825],     // Điểm dừng 1
                        [10.776889, 106.700806]  // Nhà học sinh
                    ]
                };

                // Tạo chuỗi tọa độ cho OSRM API - giống SchoolRoutes
                const coordString = parentRouteConfig.coordinates
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
                    const routeData = data.routes[0];
                    const routeCoords = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRoute(routeCoords);
                    
                    // Tạo bus data từ route data
                    const currentCoordIndex = Math.floor(Math.random() * parentRouteConfig.coordinates.length);
                    const currentCoord = parentRouteConfig.coordinates[currentCoordIndex];
                    const status = Math.random() > 0.3 ? "moving" : "stopped";
                    
                    setBusData({
                        busId: parentRouteConfig.busId,
                        route: parentRouteConfig.id,
                        routeName: parentRouteConfig.name,
                        driver: parentRouteConfig.driver,
                        studentName: parentRouteConfig.studentName,
                        status: status,
                        statusText: status === "moving" ? "Đang di chuyển" : "Đang dừng",
                        speed: status === "moving" ? `${Math.floor(Math.random() * 40 + 20)} km/h` : "0 km/h",
                        eta: `${Math.floor(Math.random() * 15 + 5)} phút`,
                        coordinates: { lat: currentCoord[0], lng: currentCoord[1] },
                        distance: Math.round(routeData.distance / 1000), // km
                        duration: Math.round(routeData.duration / 60), // phút
                        lastUpdate: new Date().toISOString()
                    });
                    
                    setBusStop([currentCoord[0], currentCoord[1]]);
                } else {
                    throw new Error("Không có tuyến đường trong response");
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching parent data from router API:', err);
                setError(`Không thể tải dữ liệu từ Router API: ${err.message}`);
                
                // Fallback data
                setBusData({
                    busId: "29B-12345",
                    route: "A1",
                    routeName: "Tuyến A1",
                    driver: "Nguyễn Văn An",
                    studentName: "Nguyễn Văn A",
                    status: "moving",
                    statusText: "Đang di chuyển",
                    speed: "35 km/h",
                    eta: "5 phút",
                    coordinates: { lat: 10.7685, lng: 106.6825 },
                    distance: 5,
                    duration: 15,
                    lastUpdate: new Date().toISOString()
                });
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, []);

    // Real-time bus location updates using router API logic
    useEffect(() => {
        if (!busData) return;

        const interval = setInterval(async () => {
            try {
                // Simulate bus movement along the route
                if (busData.status === 'moving') {
                    const newLat = busData.coordinates.lat + (Math.random() - 0.5) * 0.002;
                    const newLng = busData.coordinates.lng + (Math.random() - 0.5) * 0.002;
                    
                    setBusData(prev => ({
                        ...prev,
                        coordinates: { lat: newLat, lng: newLng },
                        lastUpdate: new Date().toISOString(),
                        speed: `${Math.floor(Math.random() * 40 + 20)} km/h`,
                        eta: `${Math.floor(Math.random() * 15 + 5)} phút`
                    }));
                    
                    setBusStop([newLat, newLng]);
                }
            } catch (err) {
                console.error('Error updating bus location:', err);
            }
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, [busData]);

    if (loading) {
        return (
            <div className="parent-container">
                <div className="loading-state" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '400px' 
                }}>
                    <div className="loading-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                    <h3>Đang tải thông tin xe buýt...</h3>
                    <p>Đang kết nối với Router API...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="parent-container">
            <button className="back-btn" onClick={() => window.history.back()}>
                ← Quay lại
            </button>

            <div className="parent-header">
                <h1>📍 Theo dõi xe đưa đón</h1>
                <p>Bản đồ định vị xe bus theo thời gian thực (Sử dụng Router API)</p>
                {error && (
                    <div className="error-message" style={{ 
                        color: '#dc2626', 
                        backgroundColor: '#fee2e2', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        margin: '10px 0',
                        border: '1px solid #fecaca',
                        fontSize: '14px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
            </div>

            {/* Student and Bus Info */}
            {busData && (
                <>
                    <div className="parent-info" style={{ 
                        padding: '15px', 
                        margin: '10px 0', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px'
                    }}>
                        <div className="info-section">
                            <h3>👧 Thông tin học sinh</h3>
                            <p><strong>Tên:</strong> {busData.studentName}</p>
                            <p><strong>Xe bus:</strong> {busData.busId}</p>
                        </div>
                        <div className="info-section">
                            <h3>🗺️ Thông tin tuyến</h3>
                            <p><strong>Tuyến:</strong> {busData.routeName}</p>
                            <p><strong>Tài xế:</strong> {busData.driver}</p>
                        </div>
                    </div>

                    <div className="bus-info" style={{ 
                        padding: '15px', 
                        margin: '10px 0', 
                        backgroundColor: '#e8f5e8', 
                        borderRadius: '8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '12px'
                    }}>
                        <div className="status-item">
                            <strong>Trạng thái:</strong>
                            <span style={{ color: busData.status === 'moving' ? '#22c55e' : '#f59e0b' }}>
                                {busData.status === 'moving' ? ' 🟢 Đang di chuyển' : ' 🟡 Đang dừng'}
                            </span>
                        </div>
                        <div className="status-item">
                            <strong>Tốc độ:</strong> {busData.speed}
                        </div>
                        <div className="status-item">
                            <strong>Thời gian đến:</strong> {busData.eta}
                        </div>
                        <div className="status-item">
                            <strong>Khoảng cách:</strong> {busData.distance}km
                        </div>
                        <div className="status-item">
                            <strong>Thời gian di chuyển:</strong> {busData.duration} phút
                        </div>
                        <div className="status-item">
                            <strong>Cập nhật lần cuối:</strong> {new Date(busData.lastUpdate).toLocaleTimeString('vi-VN')}
                        </div>
                    </div>
                </>
            )}

            <div className="parent-content">
                <div className="map-wrapper">
                    <MapContainer center={school} zoom={13} scrollWheelZoom style={{ height: "500px", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Marker trường học */}
                        <Marker position={school} icon={schoolIcon}>
                            <Popup>🏫 Trường học</Popup>
                        </Marker>

                        {/* Marker nhà học sinh */}
                        <Marker position={home} icon={homeIcon}>
                            <Popup>
                                🏠 Nhà học sinh
                                {busData && <><br/>👧 {busData.studentName}</>}
                            </Popup>
                        </Marker>

                        <Marker position={busStop} icon={busIcon}>
                            <Popup>
                                <div style={{ padding: '8px' }}>
                                    <h4 style={{ margin: '0 0 8px 0' }}>🚌 Xe bus hiện tại</h4>
                                    {busData && (
                                        <>
                                            <p style={{ margin: '4px 0' }}><strong>Xe:</strong> {busData.busId}</p>
                                            <p style={{ margin: '4px 0' }}><strong>Tuyến:</strong> {busData.routeName}</p>
                                            <p style={{ margin: '4px 0' }}><strong>Tài xế:</strong> {busData.driver}</p>
                                            <p style={{ margin: '4px 0' }}><strong>Tốc độ:</strong> {busData.speed}</p>
                                            <p style={{ margin: '4px 0' }}><strong>ETA:</strong> {busData.eta}</p>
                                            <p style={{ margin: '4px 0' }}><strong>Khoảng cách:</strong> {busData.distance}km</p>
                                        </>
                                    )}
                                </div>
                            </Popup>
                        </Marker>

                        {/* Vẽ tuyến đường nếu có */}
                        {route.length > 0 && (
                            <Polyline positions={route} pathOptions={{ color: "blue", weight: 5 }} />
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}