import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import parentService from '../../services/parentService';
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

    // --- HÀM HELPER: XÁC ĐỊNH TRẠNG THÁI DỰA VÀO loanDon, loanTra ---
    const getStudentStatus = (student) => {
        // 1. Nếu không có object attendance => Hôm nay không có lịch
        if (!student.attendance) {
            return {
                label: "Chưa có lịch",
                className: "status-no-schedule",
                icon: "📅",
                color: "#6c757d"
            };
        }

        const { loanDon, loanTra } = student.attendance;

        // 2. Ưu tiên 1: Đã trả học sinh (loanTra = true) => Về đến nơi
        if (loanTra) {
            return {
                label: "Đã đến nơi",
                className: "status-arrived",
                icon: "✓",
                color: "#16a34a"
            };
        }

        // 3. Ưu tiên 2: Đã đón nhưng chưa trả (loanDon = true, loanTra = false) => Đang trên xe
        if (loanDon && !loanTra) {
            return {
                label: "Đang trên xe",
                className: "status-on-bus",
                icon: "🚌",
                color: "#0ea5e9"
            };
        }

        // 4. Còn lại: Có lịch nhưng chưa đón (loanDon = false) => Đang chờ
        return {
            label: "Đang chờ",
            className: "status-waiting",
            icon: "⏳",
            color: "#eab308"
        };
    };

    // --- 1. LOAD DANH SÁCH HỌC SINH ---
    useEffect(() => {
        const init = async () => {
            try {
                const res = await parentService.getMyChildren();
                if (res.success) {
                    setStudents(res.data);

                    // Nếu có ID truyền từ trang khác sang thì chọn luôn học sinh đó
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

    // --- 2. POLLING VỊ TRÍ XE (3 giây/lần) & CẬP NHẬT TRẠNG THÁI ---
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
                        busInfo: actualData.busInfo || {}
                    });
                }

                // Cập nhật danh sách học sinh để lấy status loanDon/loanTra mới nhất
                const childrenRes = await parentService.getMyChildren();
                if (childrenRes.success) {
                    const updated = childrenRes.data.find(s => s.id === selectedStudent.id);
                    if (updated) {
                        setSelectedStudent(updated);
                    }
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
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [selectedStudent, routePoints]);

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