import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import parentService from '../../services/parentService';
import TrackingMap from './TrackingMap';
import '../../styles/parent-styles/parent-tracking.css';

// --- COMPONENT CHÍNH ---
const Tracking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [busData, setBusData] = useState(null);

    // State lưu danh sách điểm dừng (để vẽ Marker các trạm)
    const [routePoints, setRoutePoints] = useState([]);

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
                console.log("🔍 [Frontend] Tracking API Response:", res);

                const actualData = res?.data?.data || res?.data || res;
                console.log("🔍 [Frontend] Processed data:", actualData);

                if (!actualData) {
                    console.warn("⚠️ No data from tracking API");
                    return;
                }

                // Cập nhật vị trí xe (BUS POSITION CÓ THỂ ĐỔI LIÊN TỤC)
                const busLat = parseFloat(actualData.lat || actualData.vido);
                const busLng = parseFloat(actualData.lng || actualData.kinhdo);
                console.log(`📍 [Frontend] Bus location: ${busLat}, ${busLng}`);

                if (!isNaN(busLat) && !isNaN(busLng)) {
                    setBusData({
                        lat: busLat,
                        lng: busLng,
                        updatedAt: actualData.updatedAt || new Date().toISOString(),
                        busInfo: actualData.busInfo || {}
                    });
                }

                // Cập nhật danh sách điểm dừng (ROUTE POINTS CHỈ CẬP NHẬT LẦN ĐẦU TIÊN)
                // Nếu routePoints đã có, không cập nhật lại
                if (routePoints.length > 0) {
                    console.log("ℹ️ [Frontend] Route points already set, skipping update");
                    return;
                }

                const rawRoute = actualData.routePath;
                console.log(`🛣️  [Frontend] Raw route from API:`, rawRoute);
                console.log(`🛣️  [Frontend] Route type:`, Array.isArray(rawRoute) ? `Array(${rawRoute.length})` : typeof rawRoute);

                if (Array.isArray(rawRoute) && rawRoute.length >= 2) {
                    const validPoints = rawRoute.map((stop, idx) => {
                        const lat = parseFloat(stop?.lat || stop?.vido);
                        const lng = parseFloat(stop?.lng || stop?.kinhdo);
                        const name = stop?.name || stop?.tenDiemDung || `Điểm ${idx + 1}`;

                        console.log(`  Stop ${idx}: lat=${lat}, lng=${lng}, name=${name}`);

                        if (!isNaN(lat) && !isNaN(lng)) {
                            return { lat, lng, name };
                        }
                        console.warn(`  ⚠️ Stop ${idx} invalid: lat=${lat}, lng=${lng}`);
                        return null;
                    }).filter(Boolean);

                    console.log(`✅ [Frontend] Valid route points: ${validPoints.length}`, validPoints);

                    // Set once
                    if (validPoints.length >= 2) {
                        setRoutePoints(validPoints);
                    }
                } else {
                    console.warn(`⚠️ Route not array or < 2 points`);
                }
            } catch (err) {
                console.error("❌ [Frontend] Tracking error:", err);
            }
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 3000); // Polling mỗi 3s CHỈ bus position
        return () => clearInterval(interval);
    }, [selectedStudent, routePoints]); // routePoints trong deps để detect khi set

    // 2. Gọi OSRM API để lấy đường đi chi tiết (Chỉ chạy khi routePoints thay đổi)
    useEffect(() => {
        if (!routePoints || routePoints.length < 2) {
            console.log("⚠️ [OSRM] Not enough route points:", routePoints?.length || 0);
            return;
        }

        const fetchOSRM = async () => {
            try {
                console.log(`🚀 [OSRM] Starting with ${routePoints.length} points`);

                // Format tọa độ: {lng},{lat}
                const coordinates = routePoints.map(p => `${p.lng},${p.lat}`).join(';');
                const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

                console.log(`🌐 [OSRM] Calling: ${url.substring(0, 100)}...`);

                const res = await fetch(url);
                const data = await res.json();

                console.log(`🔍 [OSRM] Response code:`, data.code);

                if (data.code === 'Ok' && data.routes?.[0]) {
                    // Convert GeoJSON [Lng, Lat] -> Leaflet [Lat, Lng]
                    const decodedPath = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    console.log(`✅ [OSRM] Got ${decodedPath.length} polyline points`);
                    console.log(`   First 3 points:`, decodedPath.slice(0, 3));
                    console.log(`   Type of first point:`, typeof decodedPath[0], Array.isArray(decodedPath[0]));
                    setPolyLineCoords(decodedPath);
                } else {
                    console.warn(`⚠️ [OSRM] Failed with code ${data.code}, using fallback direct line`);
                    // Fallback: Nếu OSRM lỗi, vẽ đường thẳng nối các điểm dừng
                    const fallback = routePoints.map(p => [p.lat, p.lng]);
                    setPolyLineCoords(fallback);
                }
            } catch (err) {
                console.error("❌ [OSRM] Error:", err);
                // Fallback khi lỗi mạng
                const fallback = routePoints.map(p => [p.lat, p.lng]);
                console.log("📍 [OSRM] Using fallback with", fallback.length, "points");
                setPolyLineCoords(fallback);
            }
        };

        fetchOSRM();
    }, [routePoints]); // Chỉ run khi routePoints thay đổi

    const handleBack = () => {
        setSelectedStudent(null);
        setRoutePoints([]);
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
                <div className="detail-header">
                    <button onClick={handleBack} className="btn-back">← Quay lại danh sách</button>
                    <div className="detail-title">
                        <h2>{selectedStudent.name}</h2>
                    </div>
                </div>

                {/* USE NEW TRACKING MAP COMPONENT */}
                <TrackingMap
                    busData={busData}
                    routePoints={routePoints}
                    polyLineCoords={polyLineCoords}
                />

                {/* Phần thông tin chi tiết bên dưới Map */}
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

    // --- GIAO DIỆN DANH SÁCH HỌC SINH ---
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