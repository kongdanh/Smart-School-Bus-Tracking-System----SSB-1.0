import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import parentService from '../../services/parentService';
import '../../styles/parent-styles/parent-tracking.css';

// --- 1. CONFIG ICON (Để hiện icon xe buýt) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20]
});

// --- 2. DỮ LIỆU MẪU (FALLBACK) ---
const DEMO_ROUTE = [
    { lat: 10.7716, lng: 106.6995, name: "Trường ABC" },
    { lat: 10.7876, lng: 106.7032, name: "Thảo Cầm Viên" },
    { lat: 10.7932, lng: 106.6995, name: "Chợ Tân Định" },
    { lat: 10.7997, lng: 106.7188, name: "Hàng Xanh" },
    { lat: 10.7972, lng: 106.7570, name: "Metro An Phú" },
    { lat: 10.8490, lng: 106.7628, name: "Thủ Đức" }
];

// --- 3. COMPONENT ĐIỀU KHIỂN MAP VÀ VẼ ROUTE ---
const MapUpdater = ({ center }) => {
    const map = useMap();
    const prevCenter = useRef(center);

    useEffect(() => {
        if (center) {
            const dist = map.distance(prevCenter.current, center);
            if (dist > 10) {
                map.flyTo(center, map.getZoom(), { duration: 2.0, easeLinearity: 0.25 });
                prevCenter.current = center;
            }
        }
    }, [center, map]);

    return null;
};

// Component riêng để vẽ route - ĐẢM BẢO RE-RENDER
const RouteLayer = ({ routePath }) => {
    console.log("🎨 RouteLayer rendering with", routePath.length, "points");

    if (!routePath || routePath.length === 0) {
        console.warn("⚠️ RouteLayer: No route data");
        return null;
    }

    const polylinePositions = routePath.map(p => [p.lat, p.lng]);

    return (
        <>
            {/* Vẽ đường */}
            {polylinePositions.length > 1 && (
                <Polyline
                    positions={polylinePositions}
                    pathOptions={{
                        color: '#2563eb',
                        weight: 6,
                        opacity: 0.8,
                        lineJoin: 'round',
                        lineCap: 'round'
                    }}
                />
            )}

            {/* Vẽ các điểm dừng */}
            {routePath.map((stop, idx) => (
                <CircleMarker
                    key={`stop-${idx}-${stop.lat}-${stop.lng}`}
                    center={[stop.lat, stop.lng]}
                    radius={8}
                    pathOptions={{
                        color: '#ffffff',
                        fillColor: '#dc2626',
                        fillOpacity: 1,
                        weight: 3
                    }}
                >
                    <Popup>
                        <strong>Điểm {idx + 1}</strong><br />
                        {stop.name}
                    </Popup>
                </CircleMarker>
            ))}
        </>
    );
};

// --- COMPONENT CHÍNH ---
const Tracking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [busData, setBusData] = useState(null);
    const [routePath, setRoutePath] = useState(DEMO_ROUTE);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);

    // 1. Load danh sách học sinh
    useEffect(() => {
        const init = async () => {
            try {
                const res = await parentService.getMyChildren();
                if (res.success) {
                    setStudents(res.data);
                    if (location.state?.studentId) {
                        const target = res.data.find(s => s.id === location.state.studentId);
                        if (target) setSelectedStudent(target);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [location.state]);

    // 2. Polling vị trí xe
    useEffect(() => {
        if (!selectedStudent) return;

        const fetchLocation = async () => {
            try {
                const res = await parentService.getBusLocation(selectedStudent.id);

                console.log("📡 Full Response:", res);

                // Backend có thể trả về 2 cách:
                // Cách 1: { data: { success, data: {...} } }
                // Cách 2: { data: { success, lat, lng, routePath, busInfo } }

                const responseData = res.data;

                // Nếu có nested data.data thì dùng, không thì dùng data
                const actualData = responseData?.data || responseData;

                console.log("📦 Response data:", responseData);
                console.log("🎯 Actual data:", actualData);

                // Kiểm tra có lat/lng không (bỏ qua success field)
                if (actualData && (actualData.lat !== undefined || actualData.vido !== undefined)) {
                    const busLat = actualData.lat || actualData.vido;
                    const busLng = actualData.lng || actualData.kinhdo;

                    console.log("🚌 Bus position:", busLat, busLng);

                    setBusData({
                        lat: busLat,
                        lng: busLng,
                        updatedAt: actualData.updatedAt,
                        busInfo: actualData.busInfo || {}
                    });

                    // Extract route
                    const rawRoute = actualData.routePath;

                    console.log("🛣️ Raw routePath:", rawRoute);
                    console.log("🛣️ Type:", Array.isArray(rawRoute) ? 'Array' : typeof rawRoute);
                    console.log("🛣️ Length:", rawRoute?.length);

                    if (Array.isArray(rawRoute) && rawRoute.length > 0) {
                        const validRoute = rawRoute
                            .map((stop, idx) => {
                                const lat = parseFloat(stop?.lat || stop?.vido);
                                const lng = parseFloat(stop?.lng || stop?.kinhdo);
                                const name = stop?.name || stop?.tenDiemDung || `Điểm ${idx + 1}`;

                                if (!isNaN(lat) && !isNaN(lng)) {
                                    return { lat, lng, name };
                                }
                                return null;
                            })
                            .filter(Boolean);

                        console.log("✅ Valid route points:", validRoute.length);
                        console.log("✅ Route data:", validRoute);

                        if (validRoute.length > 0) {
                            setRoutePath(validRoute);
                            setIsDemoMode(false);
                        } else {
                            console.warn("⚠️ No valid points, using DEMO");
                            setRoutePath(DEMO_ROUTE);
                            setIsDemoMode(true);
                        }
                    } else {
                        console.warn("⚠️ routePath invalid:", rawRoute);
                        setRoutePath(DEMO_ROUTE);
                        setIsDemoMode(true);
                    }
                } else {
                    console.warn("⚠️ No GPS data, using Demo");
                    setIsDemoMode(true);
                    setRoutePath(DEMO_ROUTE);

                    const now = Date.now() / 10000;
                    setBusData({
                        lat: 10.7716 + (Math.sin(now) * 0.01),
                        lng: 106.6995 + (Math.cos(now) * 0.01),
                        updatedAt: new Date().toISOString(),
                        busInfo: {
                            plate: "DEMO",
                            driver: "Demo",
                            speed: 45
                        }
                    });
                }
            } catch (err) {
                console.error("❌ Error:", err);
                setIsDemoMode(true);
                setRoutePath(DEMO_ROUTE);
            }
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 3000);
        return () => clearInterval(interval);
    }, [selectedStudent]);

    const handleBack = () => {
        setSelectedStudent(null);
        navigate('/parent/tracking', { replace: true, state: {} });
    };

    // Format Data vẽ Map
    const polylinePositions = routePath.map(p => [p.lat, p.lng]);
    const busPosition = busData ? [busData.lat, busData.lng] : [10.7716, 106.6995];

    // DEBUG - Kiểm tra render
    useEffect(() => {
        console.log("🗺️ ===== MAP RENDER DATA =====");
        console.log("  Route Path array:", routePath);
        console.log("  Route Path length:", routePath.length);
        console.log("  Polyline Positions:", polylinePositions);
        console.log("  Polyline length:", polylinePositions.length);
        console.log("  Bus Position:", busPosition);
        console.log("  Is Demo Mode:", isDemoMode);
        console.log("================================");

        // Kiểm tra từng điểm
        routePath.forEach((stop, idx) => {
            console.log(`  Stop ${idx}:`, stop);
        });
    }, [routePath, busPosition, isDemoMode]);

    if (loading) return <div className="tracking-container"><p>Đang tải...</p></div>;

    // --- VIEW 1: CHI TIẾT (MAP + FULL INFO) ---
    if (selectedStudent) {
        return (
            <div className="tracking-detail-container">
                {/* Header */}
                <div className="detail-header">
                    <button onClick={handleBack} className="btn-back">← Quay lại danh sách</button>
                    <div className="detail-title">
                        <h2>{selectedStudent.name}</h2>
                        {isDemoMode && <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>(Chế độ Demo)</span>}
                    </div>
                </div>

                {/* Map Area */}
                <div className="map-container" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                    <MapContainer
                        center={busPosition}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        zoomControl={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap'
                        />

                        <MapUpdater center={busPosition} />

                        {/* Vẽ route qua component riêng */}
                        <RouteLayer routePath={routePath} />

                        {/* Xe Buýt */}
                        {busData && (
                            <Marker position={busPosition} icon={busIcon}>
                                <Popup>
                                    <strong>{busData.busInfo?.plate || "Xe buýt"}</strong><br />
                                    {isDemoMode ? "Demo" : "Real-time"}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>

                {/* Info Grid */}
                <div className="detail-info-grid">
                    <div className="info-card">
                        <h3>Thông tin chuyến xe</h3>
                        <div className="info-item">
                            <span className="info-label">Biển số:</span>
                            <span className="info-value highlight">{busData?.busInfo?.plate || "Đang cập nhật"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tài xế:</span>
                            <span className="info-value">{busData?.busInfo?.driver || "Đang cập nhật"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tốc độ:</span>
                            <span className="info-value">{busData?.speed || 40} km/h</span>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>Trạng thái</h3>
                        <div className="info-item">
                            <span className="info-label">Điểm đón:</span>
                            <span className="info-value">{selectedStudent.pickupPoint}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Trạng thái:</span>
                            <span className={`status-badge ${selectedStudent.status === 'on-bus' ? 'on-bus' : 'waiting'}`}>
                                {selectedStudent.status === 'on-bus' ? 'Đang trên xe' : 'Đang chờ'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Cập nhật:</span>
                            <span className="info-value" style={{ color: '#16a34a', fontWeight: 'bold' }}>
                                {busData ? new Date(busData.updatedAt).toLocaleTimeString() : '--:--'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: DANH SÁCH ---
    return (
        <div className="tracking-container">
            <div className="tracking-header"><h1>Theo dõi trực tiếp</h1></div>
            <div className="students-grid">
                {students.map(student => (
                    <div key={student.id} className="student-card" onClick={() => setSelectedStudent(student)}>
                        <div className="card-header"><div className="student-avatar">{student.name?.charAt(0)}</div></div>
                        <div className="card-content">
                            <h3>{student.name}</h3>
                            <p>{student.class}</p>
                            <div className="status-badge on-bus">Xem vị trí</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracking;