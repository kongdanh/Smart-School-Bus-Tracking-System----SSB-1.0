import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { CheckCircle } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../../styles/driver-styles/driver-routes.css";
import tripService from "../../services/tripService";
import locationService from "../../services/locationService";
import socketService from "../../services/socket";
import attendanceService from "../../services/attendanceService";

// --- CONFIG ICONS ---
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
    iconPopupAnchor: [0, -20]
});

const createStopIcon = (number) => {
    return L.divIcon({
        html: `<div style="background-color: #2563eb; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
        className: 'custom-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
};

// --- POLYLINE LAYER ---
const PolylineMarkerLayer = ({ polylineCoords, busData }) => {
    const map = useMap();
    const polylineRef = useRef(null);

    useEffect(() => {
        if (!map || !polylineCoords || polylineCoords.length < 2 || !busData?.lat || !busData?.lng) return;

        try {
            // Logic vẽ lại đường đi từ vị trí xe đến điểm cuối
            const busLat = busData.lat;
            const busLng = busData.lng;
            let closestIdx = 0;
            let minDist = Infinity;

            for (let i = 0; i < polylineCoords.length; i++) {
                const coord = polylineCoords[i];
                const latDiff = coord[0] - busLat;
                const lngDiff = coord[1] - busLng;
                const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = i;
                }
            }

            const remaining = polylineCoords.slice(closestIdx);

            if (polylineRef.current) {
                map.removeLayer(polylineRef.current);
            }

            if (remaining.length > 0) {
                const renderer = L.canvas();
                polylineRef.current = L.polyline(remaining, {
                    color: '#0284c7',
                    weight: 6,
                    opacity: 0.9,
                    lineCap: 'round',
                    lineJoin: 'round',
                    renderer: renderer
                }).addTo(map);
            }

        } catch (err) {
            console.error("❌ Error drawing polyline:", err);
        }
    }, [map, polylineCoords, busData]);

    return null;
};

// --- MAIN ROUTES PAGE ---
export default function RoutesPage() {
    const navigate = useNavigate();

    const [currentTrip, setCurrentTrip] = useState(null);
    const [routeStops, setRouteStops] = useState([]);
    const [polyLineCoords, setPolyLineCoords] = useState([]);
    const [busData, setBusData] = useState(null);
    const [currentStopIndex, setCurrentStopIndex] = useState(0);
    const [stopStudents, setStopStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    // --- LOAD TRIP DATA & CHECK IF CHECKED IN ---
    useEffect(() => {
        const loadTrip = async () => {
            try {
                setLoading(true);
                const dashRes = await tripService.getDriverDashboard();
                const trip = dashRes.data?.currentTrip;

                // Kiểm tra xem có đang 'in_progress' hay không
                const checkedIn = trip && trip.trangThai === 'in_progress';
                setIsCheckedIn(checkedIn);

                if (!checkedIn) {
                    setLoading(false);
                    return;
                }

                setCurrentTrip(trip);

                // --- SETUP STOPS FROM TRIP DATA ---
                if (trip.tuyenduong && trip.tuyenduong.tuyenduong_diemdung) {
                    const stops = trip.tuyenduong.tuyenduong_diemdung.map(td => ({
                        id: td.diemdung.diemDungId,
                        tenDiemDung: td.diemdung.tenDiemDung,
                        lat: parseFloat(td.diemdung.vido),
                        lng: parseFloat(td.diemdung.kinhdo),
                        diaChi: td.diemdung.diaChi
                    }));
                    setRouteStops(stops);

                    // Initialize bus location at first stop if not available
                    if (stops.length > 0) {
                        setBusData(prev => prev || {
                            lat: stops[0].lat,
                            lng: stops[0].lng
                        });
                    }
                }

            } catch (err) {
                console.error("❌ Error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadTrip();
    }, [navigate]);

    // --- SOCKET.IO REAL-TIME UPDATES ---
    useEffect(() => {
        if (!currentTrip?.lichTrinhId) return;

        const socket = socketService.getSocket();

        // Join trip room
        socket.emit('join_room', `trip_${currentTrip.lichTrinhId}`);

        // Listeners
        const handleLocationUpdate = (data) => {
            if (data.lat && data.lng) {
                setBusData({
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                });
            }
        };

        socket.on('BUS_LOCATION_UPDATE', handleLocationUpdate);

        return () => {
            socket.off('BUS_LOCATION_UPDATE', handleLocationUpdate);
            socket.emit('leave_room', `trip_${currentTrip.lichTrinhId}`);
        };
    }, [currentTrip?.lichTrinhId]);

    /* REMOVED POLLING FUNCTION
    // --- POLLING BUS & OSRM ---
    const startPolling = (trip) => {
        // Poll bus location
        const locInterval = setInterval(async () => {
            try {
                if (!trip?.xebuyt?.xeBuytId) return;
                const res = await locationService.getBusLocationById(trip.xebuyt.xeBuytId);
                if (res.success && res.data) {
                    setBusData({
                        lat: parseFloat(res.data.vido),
                        lng: parseFloat(res.data.kinhdo),
                    });
                }
            } catch (err) {
                // Silent error
            }
        }, 1000);

        return () => clearInterval(locInterval);
    };
    */

    // --- FETCH OSRM WHEN STOPS LOADED ---
    useEffect(() => {
        if (routeStops.length < 2) return;

        const fetchOSRM = async () => {
            try {
                // OSRM format: lng,lat;lng,lat
                const coordinates = routeStops.map(s => `${s.lng},${s.lat}`).join(';');
                const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.code === 'Ok' && data.routes?.[0]) {
                    // Leaflet format: [lat, lng]
                    const decodedPath = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    setPolyLineCoords(decodedPath);
                }
            } catch (err) {
                console.error("OSRM error:", err);
            }
        };

        fetchOSRM();
    }, [routeStops]);

    // --- LOAD STUDENTS AT CURRENT STOP ---
    useEffect(() => {
        if (!currentTrip || !routeStops[currentStopIndex]) return;

        const loadStudents = async () => {
            try {
                // Lấy danh sách học sinh từ currentTrip.studentTrips
                const allStudents = currentTrip.studentTrips?.map(st => ({
                    hocSinhId: st.hocsinh.hocSinhId,
                    hoTen: st.hocsinh.hoTen,
                    maHS: st.hocsinh.maHS,
                    lop: st.hocsinh.lop,
                    avatar: st.hocsinh.avatar,
                    attendance: { loanDon: false, thoiGianDon: null }
                })) || [];

                // Chia học sinh giả lập theo từng trạm (vì DB chưa có bảng mapping chi tiết từng em xuống trạm nào)
                const studentsPerStop = Math.ceil(allStudents.length / routeStops.length);
                const startIdx = currentStopIndex * studentsPerStop;
                const students = allStudents.slice(startIdx, startIdx + studentsPerStop);

                setStopStudents(students);
            } catch (err) {
                console.error("Error loading students:", err);
                setStopStudents([]);
            }
        };

        loadStudents();
        const pollInterval = setInterval(loadStudents, 2000); // Check trạng thái 'loanDon' mỗi 2s
        return () => clearInterval(pollInterval);
    }, [currentTrip, currentStopIndex, routeStops]);

    // --- ACTIONS ---
    const handleMarkPickup = async (student) => {
        if (!currentTrip) return;
        try {
            const res = await attendanceService.markPickup(currentTrip.lichTrinhId, student.hocSinhId);
            if (res.success) {
                // Cập nhật state ngay lập tức
                setStopStudents(prev => prev.map(s =>
                    s.hocSinhId === student.hocSinhId ? { ...s, attendance: { ...s.attendance, loanDon: true, thoiGianDon: new Date().toISOString() } } : s
                ));
            }
        } catch (err) {
            console.error("Error mark pickup:", err);
        }
    };

    const allPickedUp = stopStudents.length === 0 || stopStudents.every(s => s.attendance?.loanDon);

    const handleCompleteStop = () => {
        if (!allPickedUp) {
            alert("Vui lòng đón hết học sinh tại trạm này!");
            return;
        }

        if (currentStopIndex < routeStops.length - 1) {
            setCurrentStopIndex(currentStopIndex + 1);
        } else {
            alert("🎉 Đã về bến cuối! Hoàn thành chuyến xe.");
            // Logic kết thúc chuyến có thể thêm ở đây (gọi API endTrip)
        }
    };

    const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";

    const mapCenter = useMemo(() => {
        if (busData) return [busData.lat, busData.lng];
        if (routeStops.length > 0) return [routeStops[0].lat, routeStops[0].lng];
        return [10.762622, 106.682228]; // Mặc định LHP
    }, [busData, routeStops]);

    if (loading) return <div className="loading-screen">Đang tải thông tin chuyến xe...</div>;

    // --- LOCK UI IF NOT CHECKED IN ---
    if (!isCheckedIn) {
        return (
            <div className="routes-driver-container">
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '40px', borderRadius: '12px',
                        textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', width: '90%', maxWidth: '400px'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚍</div>
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Chưa vào ca</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            Tài xế <strong>Nguyễn Văn A</strong> chưa bắt đầu chuyến xe.<br />Vui lòng Check-in để bắt đầu.
                        </p>
                        <button
                            onClick={() => navigate('/driver/check-in-out')}
                            style={{
                                backgroundColor: '#2563eb', color: 'white', border: 'none',
                                padding: '12px 32px', borderRadius: '6px', cursor: 'pointer',
                                fontSize: '16px', fontWeight: 'bold'
                            }}
                        >
                            Đến trang Check-in
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="routes-driver-container">
            {/* MAP */}
            <div className="routes-map-section">
                <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {polyLineCoords.length > 0 && busData && (
                        <PolylineMarkerLayer polylineCoords={polyLineCoords} busData={busData} />
                    )}

                    {busData && (
                        <Marker position={[busData.lat, busData.lng]} icon={busIcon} zIndexOffset={1000}>
                            <Popup>Xe Bus (Tài xế 1)</Popup>
                        </Marker>
                    )}

                    {routeStops.map((stop, idx) => (
                        <Marker key={idx} position={[stop.lat, stop.lng]} icon={createStopIcon(idx + 1)}>
                            <Popup>
                                <strong>{stop.tenDiemDung}</strong><br />
                                {stop.diaChi}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* PANEL */}
            <div className="routes-panel">
                <div className="panel-header">
                    <h2>Lộ trình: Tuyến 1</h2>
                    <span className="stop-counter">Trạm {currentStopIndex + 1}/{routeStops.length}</span>
                </div>

                <div className="stops-list">
                    {routeStops.map((stop, idx) => (
                        <div key={idx}
                            className={`stop-item ${idx === currentStopIndex ? 'current' : ''} ${idx < currentStopIndex ? 'completed' : ''}`}
                        >
                            <div className="stop-num">{idx + 1}</div>
                            <div className="stop-detail">
                                <h4>{stop.tenDiemDung}</h4>
                                <p>{stop.diaChi}</p>
                            </div>
                            {idx < currentStopIndex && <CheckCircle size={16} color="green" />}
                        </div>
                    ))}
                </div>

                <div className="current-stop-panel">
                    <h3>📍 {routeStops[currentStopIndex]?.tenDiemDung}</h3>
                    <p className="subtitle">{stopStudents.length} học sinh cần đón</p>

                    <div className="students-list">
                        {stopStudents.length === 0 && <p className="no-data">Không có học sinh tại trạm này</p>}
                        {stopStudents.map(s => (
                            <div key={s.hocSinhId} className={`student-row ${s.attendance?.loanDon ? 'picked' : ''}`}>
                                <div className="student-info">
                                    <div className="avatar">{s.hoTen?.[0] || "?"}</div>
                                    <div>
                                        <strong>{s.hoTen}</strong>
                                        <div className="code">{s.maHS}</div>
                                    </div>
                                </div>
                                <button
                                    className={`btn-pickup ${s.attendance?.loanDon ? 'done' : ''}`}
                                    onClick={() => handleMarkPickup(s)}
                                    disabled={s.attendance?.loanDon}
                                >
                                    {s.attendance?.loanDon ? `✓ ${formatTime(s.attendance.thoiGianDon)}` : "Đón"}
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        className={`btn-complete-stop ${allPickedUp ? 'enabled' : 'disabled'}`}
                        onClick={handleCompleteStop}
                    >
                        {currentStopIndex === routeStops.length - 1 ? '🏁 Kết thúc chuyến' : 'Tiếp tục ➡'}
                    </button>
                </div>
            </div>
        </div>
    );
}   