import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import parentService from '../../services/parentService';
import '../../styles/parent-styles/parent-tracking.css';

// --- 1. CONFIG ICON ---
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

// --- 2. DỮ LIỆU MẪU ---
const DEMO_ROUTE = [
    { lat: 10.7716, lng: 106.6995, name: "Trường ABC" },
    { lat: 10.7876, lng: 106.7032, name: "Thảo Cầm Viên" },
    { lat: 10.7932, lng: 106.6995, name: "Chợ Tân Định" },
    { lat: 10.7997, lng: 106.7188, name: "Hàng Xanh" },
    { lat: 10.7972, lng: 106.7570, name: "Metro An Phú" },
    { lat: 10.8490, lng: 106.7628, name: "Thủ Đức" }
];

// --- 3. COMPONENT ĐIỀU KHIỂN MAP ---
const MapUpdater = ({ center }) => {
    const map = useMap();
    const prevCenter = useRef(center);

    useEffect(() => {
        if (center && center[0] && center[1]) {
            const dist = map.distance(prevCenter.current, center);
            if (dist > 10) {
                map.flyTo(center, map.getZoom(), { duration: 2.0, easeLinearity: 0.25 });
                prevCenter.current = center;
            }
        }
    }, [center, map]);

    return null;
};

// --- 4. ROUTE LAYER (ĐÃ SỬA LỖI MÀU & TỐI ƯU RE-RENDER) ---
// Sử dụng React.memo để ngăn việc vẽ lại đường khi xe di chuyển
const RouteLayer = React.memo(({ routePath }) => {
    const [osrmPath, setOsrmPath] = useState([]);
    const map = useMap();

    useEffect(() => {
        if (!routePath || routePath.length < 2) {
            setOsrmPath([]);
            return;
        }

        // 1. Zoom map (Chỉ zoom khi lộ trình thay đổi)
        const bounds = routePath.map(p => [p.lat, p.lng]);
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        // 2. Gọi OSRM
        const fetchRouteFromOSRM = async () => {
            try {
                // Logic lấy mẫu giữ nguyên...
                const step = Math.ceil(routePath.length / 10);
                const sampledRoute = routePath.filter((_, index) => index % step === 0);

                if (sampledRoute[0] !== routePath[0]) sampledRoute.unshift(routePath[0]);
                if (sampledRoute[sampledRoute.length - 1] !== routePath[routePath.length - 1]) {
                    sampledRoute.push(routePath[routePath.length - 1]);
                }

                const coordString = sampledRoute
                    .map(point => `${point.lng},${point.lat}`)
                    .join(';');

                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
                );

                if (res.ok) {
                    const data = await res.json();
                    if (data.routes && data.routes.length > 0) {
                        const routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        setOsrmPath(routeCoords);
                    }
                }
            } catch (error) {
                console.warn("OSRM error, using straight line");
            }
        };

        fetchRouteFromOSRM();
    }, [routePath, map]); // Chỉ chạy lại khi routePath thay đổi

    if (!routePath || routePath.length === 0) return null;

    const straightLinePath = routePath.map(p => [p.lat, p.lng]);

    return (
        <>
            {/* --- LỚP 1: ĐƯỜNG THẲNG (FALLBACK) --- */}
            <Polyline
                positions={straightLinePath}
                pathOptions={{
                    color: '#6b7280', // <--- ĐÃ SỬA MÀU TẠI ĐÂY
                    weight: 6,        // Tăng độ dày lên chút cho dễ nhìn
                    opacity: 0.6,
                    dashArray: '10, 10',
                    lineCap: 'round'
                }}
            />

            {/* --- LỚP 2: ĐƯỜNG OSRM (NẾU CÓ) --- */}
            {osrmPath.length > 0 && (
                <Polyline
                    positions={osrmPath}
                    pathOptions={{
                        color: '#2563eb', // Màu xanh
                        weight: 6,
                        opacity: 0.8,
                        lineJoin: 'round'
                    }}
                />
            )}

            {/* Markers */}
            {routePath.map((stop, idx) => (
                <CircleMarker
                    key={`stop-${idx}-${stop.lat}`}
                    center={[stop.lat, stop.lng]}
                    radius={6}
                    pathOptions={{
                        color: '#fff',
                        fillColor: idx === 0 ? '#10b981' : (idx === routePath.length - 1 ? '#ef4444' : '#3b82f6'),
                        fillOpacity: 1,
                        weight: 2
                    }}
                >
                    <Popup><strong>{stop.name}</strong></Popup>
                </CircleMarker>
            ))}
        </>
    );
}, (prevProps, nextProps) => {
    // Hàm so sánh custom cho React.memo
    // Nếu độ dài mảng hoặc tọa độ điểm đầu/cuối giống nhau thì KHÔNG render lại
    if (prevProps.routePath === nextProps.routePath) return true;
    return JSON.stringify(prevProps.routePath) === JSON.stringify(nextProps.routePath);
});

// --- 5. COMPONENT CHÍNH (FIXED) ---
const Tracking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [busData, setBusData] = useState(null);
    const [routePath, setRoutePath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Load danh sách học sinh
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

                // debug error
                // console.error("❌ Error loading students:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [location.state]);

    // Polling vị trí xe (FIXED)
    useEffect(() => {
        if (!selectedStudent) return;

        const fetchLocation = async () => {
            try {
                // debug id student
                // console.log("🔄 [Tracking] Fetching location for student:", selectedStudent.id);

                const res = await parentService.getBusLocation(selectedStudent.id);

                // debug full response
                //console.log("📥 [Tracking] API Response:", res);

                const actualData = res?.data?.data || res?.data || res;
                // debug actual data
                //console.log("📦 [Tracking] Actual data:", actualData);

                if (!actualData) {
                    console.warn("⚠️ [Tracking] No data received, switching to demo");
                    setIsDemoMode(true);
                    setRoutePath(DEMO_ROUTE);
                    return;
                }

                // Xử lý vị trí xe
                const busLat = parseFloat(actualData.lat || actualData.vido);

                console.log("Parsed busLat:", busLat);
                console.log("type of buslat?", typeof busLat);
                const busLng = parseFloat(actualData.lng || actualData.kinhdo);

                console.log("Parsed busLng:", busLng);
                if (!isNaN(busLat) && !isNaN(busLng)) {
                    setBusData({
                        lat: busLat,
                        lng: busLng,
                        updatedAt: actualData.updatedAt || new Date().toISOString(),
                        busInfo: actualData.busInfo || {}
                    });

                    // debug bus position
                    // console.log("✅ [Tracking] Bus position updated:", busLat, busLng);
                }

                const rawRoute = actualData.routePath;

                // debug raw routePath
                // console.log("🛣️ [Tracking] Raw routePath:", rawRoute);

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

                    // debug valid route
                    // console.log("✅ [Tracking] Valid route points:", validRoute.length);

                    if (validRoute.length >= 2) {
                        setRoutePath(validRoute);
                        setIsDemoMode(false);

                        // debug route set
                        // console.log("✅ [Tracking] Route set successfully:", validRoute);
                    } else {

                        // debug insufficient points
                        // console.warn("⚠️ [Tracking] Not enough valid points, using demo");
                        setRoutePath(DEMO_ROUTE);
                        setIsDemoMode(true);
                    }
                } else {

                    // debug no routePath
                    // console.warn("⚠️ [Tracking] No routePath in response, using demo");
                    setRoutePath(DEMO_ROUTE);
                    setIsDemoMode(true);
                }

            } catch (err) {

                // debug error
                // console.error("❌ [Tracking] Error fetching location:", err);
                setIsDemoMode(true);
                setRoutePath(DEMO_ROUTE);
            }
        };

        fetchLocation();

        const interval = setInterval(fetchLocation, 3000); // 3s polling
        return () => clearInterval(interval);
    }, [selectedStudent]);

    const handleBack = () => {
        setSelectedStudent(null);
        setRoutePath([]);
        navigate('/parent/tracking', { replace: true, state: {} });
    };

    const busPosition = busData ? [busData.lat, busData.lng] : [10.7716, 106.6995];

    if (loading) {
        return (
            <div className="tracking-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // --- VIEW 1: CHI TIẾT MAP ---
    if (selectedStudent) {
        return (
            <div className="tracking-detail-container">
                <div className="detail-header">
                    <button onClick={handleBack} className="btn-back">
                        ← Quay lại danh sách
                    </button>
                    <div className="detail-title">
                        <h2>{selectedStudent.name}</h2>
                        {isDemoMode && (
                            <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}>
                                (Chế độ Demo - Không có dữ liệu thực)
                            </span>
                        )}
                    </div>
                </div>

                <div className="map-container">
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

                        {routePath.length > 0 && <RouteLayer routePath={routePath} />}

                        {busData && (
                            <Marker position={busPosition} icon={busIcon}>
                                <Popup>
                                    <strong>{busData.busInfo?.plate || "Xe buýt"}</strong><br />
                                    {isDemoMode ? "Demo Mode" : "Real-time Tracking"}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>

                <div className="detail-info-grid">
                    <div className="info-card">
                        <div className="info-icon bus">🚌</div>
                        <h3>Thông tin chuyến xe</h3>
                        <div className="info-item">
                            <span className="info-label">Biển số:</span>
                            <span className="info-value highlight">
                                {busData?.busInfo?.plate || selectedStudent.busPlate || "Đang cập nhật"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tài xế:</span>
                            <span className="info-value">
                                {busData?.busInfo?.driver || selectedStudent.driver || "Đang cập nhật"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tuyến đường:</span>
                            <span className="info-value">
                                {busData?.busInfo?.routeName || "Đang cập nhật"}
                            </span>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon student">📍</div>
                        <h3>Trạng thái học sinh</h3>
                        <div className="info-item">
                            <span className="info-label">Điểm đón:</span>
                            <span className="info-value">{selectedStudent.pickupPoint}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Trạng thái:</span>
                            <span className={`status-badge small ${selectedStudent.status === 'on-bus' ? 'status-on-bus' : 'status-waiting'}`}>
                                <span className="status-dot"></span>
                                {selectedStudent.status === 'on-bus' ? 'Đang trên xe' :
                                    selectedStudent.status === 'arrived' ? 'Đã đến nơi' : 'Đang chờ'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Cập nhật:</span>
                            <span className="info-value" style={{ color: '#16a34a' }}>
                                {busData ? new Date(busData.updatedAt).toLocaleTimeString('vi-VN') : '--:--'}
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
            <div className="tracking-header">
                <div className="header-content-tracking">
                    <h1>Theo dõi trực tiếp</h1>
                    <p className="tracking-subtitle">Xem vị trí xe và lộ trình di chuyển của học sinh</p>
                </div>
            </div>

            <div className="students-grid">
                {students.map(student => (
                    <div key={student.id} className="student-card" onClick={() => setSelectedStudent(student)}>
                        <div className="card-header">
                            <div className="student-avatar">{student.name?.charAt(0)}</div>
                            <div className={`status-indicator ${student.status === 'on-bus' ? 'status-on-bus' : 'status-waiting'}`}>
                                {student.status === 'on-bus' ? '🚌' : student.status === 'arrived' ? '✓' : '⏳'}
                            </div>
                        </div>
                        <div className="card-content">
                            <h3>{student.name}</h3>
                            <p className="student-class">{student.class}</p>
                            <button className="btn-view-route">
                                Xem vị trí & Lộ trình ➜
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracking;