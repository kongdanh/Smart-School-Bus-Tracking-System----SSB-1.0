import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import parentService from '../../services/parentService';
import socketService from '../../services/socket';
import TrackingMap from './TrackingMap';
import '../../styles/parent-styles/parent-tracking.css';

const Tracking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [busData, setBusData] = useState(null);
    const [routePoints, setRoutePoints] = useState([]);
    const [polyLineCoords, setPolyLineCoords] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- HÀM HELPER: XÁC ĐỊNH TRẠNG THÁI DỰA VÀO status TỪ BACKEND ---
    const getStudentStatus = (student) => {
        // Sử dụng field 'status' từ API (giống Dashboard)
        const status = student.status || 'home';

        switch (status) {
            case 'arrived':
                return {
                    label: "Đã đến nơi",
                    className: "status-arrived",
                    icon: "✓",
                    color: "#16a34a"
                };
            case 'on-bus':
                return {
                    label: "Đang trên xe",
                    className: "status-on-bus",
                    icon: "🚌",
                    color: "#0ea5e9"
                };
            case 'waiting':
                return {
                    label: "Đang chờ",
                    className: "status-waiting",
                    icon: "⏳",
                    color: "#eab308"
                };
            default:
                return {
                    label: "Chưa có lịch",
                    className: "status-no-schedule",
                    icon: "📅",
                    color: "#6c757d"
                };
        }
    };

    // --- HÀM HELPER: TÍNH ETA ---
    const calculateETA = (busLat, busLng, stopLat, stopLng) => {
        if (!busLat || !busLng || !stopLat || !stopLng) return null;

        // Haversine formula for distance
        const R = 6371; // Radius of the earth in km
        const dLat = (stopLat - busLat) * (Math.PI / 180);
        const dLon = (stopLng - busLng) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(busLat * (Math.PI / 180)) * Math.cos(stopLat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;

        // Assume average speed 30 km/h
        const speedKmh = 30;
        const timeHours = distanceKm / speedKmh;
        const timeMinutes = Math.ceil(timeHours * 60);

        return timeMinutes;
    };

    // --- 1. LOAD DANH SÁCH HỌC SINH & POLLING ---
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await parentService.getMyChildren();
                if (res.success) {
                    setStudents(res.data);
                }
            } catch (error) {
                console.error("Lỗi load học sinh:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
        const interval = setInterval(fetchStudents, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    // --- 1.1 UPDATE SELECTED STUDENT & HANDLE NAVIGATION STATE ---
    useEffect(() => {
        if (students.length === 0) return;

        // Case 1: Initial navigation from Dashboard
        if (!selectedStudent && location.state?.studentId) {
            const target = students.find(s => s.id === location.state.studentId);
            if (target) setSelectedStudent(target);
        }

        // Case 2: Update currently selected student with new data
        if (selectedStudent) {
            const updated = students.find(s => s.id === selectedStudent.id);
            if (updated) {
                // Check if critical fields changed to avoid infinite loops
                const hasChanged =
                    updated.status !== selectedStudent.status ||
                    updated.diemDon !== selectedStudent.diemDon ||
                    updated.busPlate !== selectedStudent.busPlate;

                if (hasChanged) {
                    setSelectedStudent(prev => ({ ...prev, ...updated }));
                }
            }
        }
    }, [students, location.state]); // Removed selectedStudent from deps to avoid loop, relying on students update to trigger check

    // --- 2. POLLING VỊ TRÍ XE (Chỉ chạy 1 lần đầu để lấy dữ liệu ban đầu) ---
    useEffect(() => {
        if (!selectedStudent) return;

        const fetchData = async () => {
            try {
                // Lấy vị trí xe
                const locationRes = await parentService.getBusLocation(selectedStudent.id);
                const actualData = locationRes?.data?.data || locationRes?.data || locationRes;

                if (!actualData) return;

                const busLat = parseFloat(actualData.lat || actualData.vido);
                const busLng = parseFloat(actualData.lng || actualData.kinhdo);

                if (!isNaN(busLat) && !isNaN(busLng)) {
                    setBusData({
                        lat: busLat,
                        lng: busLng,
                        updatedAt: actualData.updatedAt || new Date().toISOString(),
                        busInfo: actualData.busInfo || {},
                        scheduleId: actualData.scheduleId
                    });
                }

                // Cập nhật các điểm dừng (Route Points) - Chỉ làm 1 lần nếu chưa có
                if (routePoints.length === 0 && actualData.routePath && Array.isArray(actualData.routePath)) {
                    const validPoints = actualData.routePath.map((stop, idx) => {
                        const lat = parseFloat(stop?.lat || stop?.vido);
                        const lng = parseFloat(stop?.lng || stop?.kinhdo);
                        const name = stop?.name || stop?.tenDiemDung || `Điểm ${idx + 1}`;
                        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng, name };
                        return null;
                    }).filter(Boolean);

                    if (validPoints.length >= 2) setRoutePoints(validPoints);
                }
            } catch (err) {
                // Lỗi khi poll thì bỏ qua để không spam console
            }
        };

        fetchData();
        // KHÔNG POLLING LIÊN TỤC NỮA VÌ ĐÃ CÓ SOCKET
        // Nếu muốn fallback, hãy đặt interval rất dài (ví dụ 30s)
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [selectedStudent?.id]); // Chỉ chạy lại khi ID học sinh thay đổi, không phải toàn bộ object

    // --- SOCKET.IO REAL-TIME UPDATES ---
    useEffect(() => {
        if (!busData?.scheduleId) return;

        const socket = socketService.getSocket();

        // Join trip room (Backend expects 'join_trip_room' with ID)
        socket.emit('join_trip_room', busData.scheduleId);

        // Listeners
        const handleLocationUpdate = (data) => {
            if (data.lat && data.lng) {
                setBusData(prev => ({
                    ...prev,
                    lat: data.lat,
                    lng: data.lng,
                    updatedAt: new Date().toISOString()
                }));
            }
        };

        const handleNotification = (data) => {
            // Notifications are handled globally in ParentPortal now, 
            // but we can keep this if we want specific trip alerts
            // toast.info(data.message);
        };

        socket.on('BUS_LOCATION_UPDATE', handleLocationUpdate);
        // socket.on('NEW_NOTIFICATION', handleNotification);

        return () => {
            socket.off('BUS_LOCATION_UPDATE', handleLocationUpdate);
            // socket.off('NEW_NOTIFICATION', handleNotification);
            // socket.emit('leave_room', `trip_${busData.scheduleId}`); // Backend might not support leave_room yet
        };
    }, [busData?.scheduleId]);

    // --- 3. VẼ ĐƯỜNG ĐI (OSRM) - THÊM TRƯỜNG HỌC LÀM ĐIỂM CUỐI ---
    useEffect(() => {
        if (!routePoints || routePoints.length < 2) return;

        const fetchOSRM = async () => {
            try {
                // Thêm trường học (10.762622, 106.660172) vào cuối danh sách điểm dừng
                const schoolLocation = { lat: 10.762622, lng: 106.660172, name: "Trường học" };
                const allPoints = [...routePoints, schoolLocation];

                // Tạo chuỗi tọa độ cho OSRM: lng,lat;lng,lat
                const coordinates = allPoints.map(p => `${p.lng},${p.lat}`).join(';');
                const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.code === 'Ok' && data.routes?.[0]) {
                    // OSRM trả về [lng, lat], Leaflet cần [lat, lng] -> Đảo ngược lại
                    const decodedPath = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    setPolyLineCoords(decodedPath);
                } else {
                    // Fallback: Vẽ đường thẳng nối các điểm nếu OSRM lỗi
                    setPolyLineCoords(allPoints.map(p => [p.lat, p.lng]));
                }
            } catch (err) {
                // Fallback khi OSRM lỗi
                const schoolLocation = { lat: 10.762622, lng: 106.660172 };
                const allPoints = [...routePoints, schoolLocation];
                setPolyLineCoords(allPoints.map(p => [p.lat, p.lng]));
            }
        };

        fetchOSRM();
    }, [routePoints]);

    // --- NAVIGATION ---
    const handleBack = () => {
        setSelectedStudent(null);
        setRoutePoints([]);
        setPolyLineCoords([]);
        setBusData(null);
        navigate('/parent/tracking', { replace: true, state: {} });
    };

    if (loading) {
        return (
            <div className="tracking-container">
                <div className="loading-container"><div className="spinner"></div><p>Đang tải dữ liệu...</p></div>
            </div>
        );
    }

    // --- VIEW: BẢN ĐỒ CHI TIẾT ---
    if (selectedStudent) {
        const statusInfo = getStudentStatus(selectedStudent);

        return (
            <div className="tracking-detail-container">
                <div className="detail-header">
                    <button onClick={handleBack} className="btn-back">← Quay lại danh sách</button>
                    <div className="detail-title">
                        <h2>{selectedStudent.name || selectedStudent.hoTen}</h2>
                    </div>
                </div>

                <TrackingMap
                    busData={busData}
                    routePoints={routePoints}
                    polyLineCoords={polyLineCoords}
                />

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
                    </div>

                    <div className="info-card">
                        <div className="info-icon student">📍</div>
                        <h3>Trạng thái học sinh</h3>
                        <div className="info-item">
                            <span className="info-label">Điểm đón:</span>
                            <span className="info-value">{selectedStudent.diemDon || selectedStudent.pickupPoint || "Tại nhà"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Trạng thái:</span>
                            <span className={`status-badge small ${statusInfo.className}`}>
                                <span className="status-dot" style={{ backgroundColor: statusInfo.color }}></span>
                                {statusInfo.label}
                            </span>
                        </div>
                        {statusInfo.label === 'Đang chờ' && busData && selectedStudent && (
                            <div className="info-item">
                                <span className="info-label">Dự kiến đến:</span>
                                <span className="info-value highlight" style={{ color: '#eab308' }}>
                                    {(() => {
                                        // Tìm tọa độ điểm đón của học sinh trong routePoints
                                        // Giả sử tên điểm đón khớp với tên trạm
                                        const pickupPointName = selectedStudent.diemDon || selectedStudent.pickupPoint;
                                        const stop = routePoints.find(p => p.name === pickupPointName) || routePoints[0]; // Fallback điểm đầu

                                        if (stop) {
                                            const minutes = calculateETA(busData.lat, busData.lng, stop.lat, stop.lng);
                                            return minutes ? `${minutes} phút` : 'Đang tính...';
                                        }
                                        return 'Đang tính...';
                                    })()}
                                </span>
                            </div>
                        )}
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

    // --- VIEW: DANH SÁCH HỌC SINH ---
    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <div className="header-content-tracking">
                    <h1>Theo dõi trực tiếp</h1>
                    <p className="tracking-subtitle">Xem vị trí xe và lộ trình di chuyển</p>
                </div>
            </div>
            <div className="students-grid">
                {students.map(student => {
                    const statusInfo = getStudentStatus(student);

                    return (
                        <div key={student.id || student.hocSinhId} className="student-card" onClick={() => setSelectedStudent(student)}>
                            <div className="card-header">
                                <div className="student-avatar">{(student.name || student.hoTen)?.charAt(0)}</div>
                                <div className={`status-indicator ${statusInfo.className}`}>
                                    {statusInfo.icon}
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{student.name || student.hoTen}</h3>
                                <p className="student-class">{student.class || student.lop}</p>

                                {/* Label trạng thái text */}
                                <div className={`status-badge small ${statusInfo.className}`} style={{ marginBottom: '10px', display: 'inline-flex' }}>
                                    {statusInfo.label}
                                </div>

                                <button className="btn-view-route">
                                    Xem lộ trình ➜
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tracking;