import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
// import 'leaflet/dist/leaflet.css'; // Không cần dòng này nữa vì đã thêm ở index.html
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

// --- 2. COMPONENT ĐIỀU KHIỂN CAMERA & FIX LỖI RENDER ---
const MapHandler = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        // Fix lỗi map bị xám/lệch khi mới load
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 400);

        if (center) {
            // Di chuyển camera mượt mà
            map.flyTo(center, map.getZoom() > 13 ? map.getZoom() : 13, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
        return () => clearTimeout(timer);
    }, [map, center]);

    return null;
};

// --- 3. COMPONENT CHÍNH ---
const Tracking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [busData, setBusData] = useState(null);

    // State lưu danh sách điểm dừng (để vẽ Marker các trạm)
    const [routePath, setRoutePath] = useState([]);

    // State lưu tọa độ đường đi thực tế từ OSRM (để vẽ Polyline màu xanh)
    const [polyLineCoords, setPolyLineCoords] = useState([]);

    const [loading, setLoading] = useState(true);

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
                console.error("Lỗi load học sinh:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [location.state]);

    // 1. Polling dữ liệu vị trí xe & danh sách điểm dừng
    useEffect(() => {
        if (!selectedStudent) return;

        const fetchLocation = async () => {
            try {
                const res = await parentService.getBusLocation(selectedStudent.id);
                const actualData = res?.data?.data || res?.data || res;

                if (!actualData) return;

                // Cập nhật vị trí xe
                const busLat = parseFloat(actualData.lat || actualData.vido);
                const busLng = parseFloat(actualData.lng || actualData.kinhdo);
                if (!isNaN(busLat) && !isNaN(busLng)) {
                    setBusData({
                        lat: busLat,
                        lng: busLng,
                        updatedAt: actualData.updatedAt || new Date().toISOString(),
                        busInfo: actualData.busInfo || {}
                    });
                }

                // Cập nhật danh sách điểm dừng (Route Points)
                const rawRoute = actualData.routePath;
                if (Array.isArray(rawRoute) && rawRoute.length >= 2) {
                    const validRoute = rawRoute.map((stop, idx) => {
                        const lat = parseFloat(stop?.lat || stop?.vido);
                        const lng = parseFloat(stop?.lng || stop?.kinhdo);
                        const name = stop?.name || stop?.tenDiemDung || `Điểm ${idx + 1}`;
                        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng, name };
                        return null;
                    }).filter(Boolean);

                    // Chỉ update state nếu dữ liệu thay đổi (deep comparison đơn giản)
                    if (validRoute.length >= 2) {
                        setRoutePath(prev => JSON.stringify(prev) !== JSON.stringify(validRoute) ? validRoute : prev);
                    }
                }
            } catch (err) {
                console.error("Lỗi tracking:", err);
            }
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 3000); // Polling mỗi 3s
        return () => clearInterval(interval);
    }, [selectedStudent]);

    // 2. Gọi OSRM API để lấy đường đi chi tiết (Chỉ chạy khi routePath thay đổi)
    useEffect(() => {
        if (!routePath || routePath.length < 2) {
            setPolyLineCoords([]);
            return;
        }

        const fetchOSRM = async () => {
            // Lấy mẫu (Sampling) để giảm độ dài URL nếu có quá nhiều điểm
            const step = Math.ceil(routePath.length / 20);
            const waypoints = routePath.filter((_, i) => i === 0 || i === routePath.length - 1 || i % step === 0);

            // Format tọa độ: {lng},{lat}
            const coordinates = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
            const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

            try {
                const res = await fetch(url);
                const data = await res.json();

                if (data.code === 'Ok' && data.routes?.[0]) {
                    // Convert GeoJSON [Lng, Lat] -> Leaflet [Lat, Lng]
                    const decodedPath = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    setPolyLineCoords(decodedPath);
                } else {
                    // Fallback: Nếu OSRM lỗi, vẽ đường thẳng nối các điểm dừng
                    console.warn("OSRM không tìm thấy đường, dùng đường thẳng fallback");
                    setPolyLineCoords(routePath.map(p => [p.lat, p.lng]));
                }
            } catch (err) {
                console.error("Lỗi kết nối OSRM", err);
                // Fallback khi lỗi mạng
                setPolyLineCoords(routePath.map(p => [p.lat, p.lng]));
            }
        };

        fetchOSRM();
    }, [routePath]);

    const handleBack = () => {
        setSelectedStudent(null);
        setRoutePath([]);
        setPolyLineCoords([]);
        setBusData(null);
        navigate('/parent/tracking', { replace: true, state: {} });
    };

    const busPosition = busData ? [busData.lat, busData.lng] : [10.7716, 106.6995];

    if (loading) {
        return (
            <div className="tracking-container">
                <div className="loading-container"><div className="spinner"></div><p>Đang tải dữ liệu...</p></div>
            </div>
        );
    }

    // --- GIAO DIỆN BẢN ĐỒ CHI TIẾT ---
    if (selectedStudent) {
        return (
            <div className="tracking-detail-container">
                <div className="detail-header" style={{ marginBottom: '16px' }}>
                    <button onClick={handleBack} className="btn-back">← Quay lại danh sách</button>
                    <div className="detail-title">
                        <h2>Lộ trình: {selectedStudent.name}</h2>
                    </div>
                </div>

                <div className="map-container" style={{
                    position: 'relative',
                    height: '75vh',
                    width: '100%',
                    zIndex: 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <MapContainer
                        center={busPosition}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap'
                        />

                        {/* 1. Xử lý camera & fix lỗi render */}
                        <MapHandler center={busPosition} />

                        {/* 2. VẼ TUYẾN ĐƯỜNG (Polyline) */}
                        {polyLineCoords.length > 0 && (
                            <Polyline
                                key={`route-${polyLineCoords.length}`} // Key quan trọng để React vẽ lại
                                positions={polyLineCoords}
                                pathOptions={{
                                    color: '#2563eb', // Màu xanh dương
                                    weight: 6,
                                    opacity: 0.8,
                                    lineJoin: 'round',
                                    lineCap: 'round'
                                }}
                            />
                        )}

                        {/* 3. MARKER XE BUÝT */}
                        {busData && (
                            <Marker position={busPosition} icon={busIcon}>
                                <Popup>
                                    <div style={{ textAlign: 'center' }}>
                                        <strong>{busData.busInfo?.plate || "Xe buýt"}</strong><br />
                                        <small>{busData.busInfo?.driver}</small>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* 4. MARKER CÁC ĐIỂM DỪNG */}
                        {routePath.map((p, idx) => (
                            <Marker key={`stop-${idx}`} position={[p.lat, p.lng]}>
                                <Popup>{p.name || `Trạm dừng ${idx + 1}`}</Popup>
                            </Marker>
                        ))}

                    </MapContainer>
                </div>
            </div>
        );
    }

    // --- GIAO DIỆN DANH SÁCH HỌC SINH ---
    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <div className="header-content-tracking">
                    <h1>Theo dõi trực tiếp</h1>
                    <p className="tracking-subtitle">Chọn học sinh để xem vị trí xe trên bản đồ</p>
                </div>
            </div>
            <div className="students-grid">
                {students.map(student => (
                    <div key={student.id} className="student-card" onClick={() => setSelectedStudent(student)}>
                        <div className="card-header">
                            <div className="student-avatar">{student.name?.charAt(0)}</div>
                            <div className={`status-indicator ${student.status === 'on-bus' ? 'status-on-bus' : 'status-waiting'}`}>
                                {student.status === 'on-bus' ? '🚌' : '📍'}
                            </div>
                        </div>
                        <div className="card-content">
                            <h3>{student.name}</h3>
                            <p className="student-class">{student.class}</p>
                            <button className="btn-view-route">Xem bản đồ ➜</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracking;