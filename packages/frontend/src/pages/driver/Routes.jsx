import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/driver-styles/driver-routes.css";
import {
    Navigation, Clock, MapPin, Users, CheckCircle,
    Phone, X, Info, Bus as BusIcon, School
} from "lucide-react";

// Mock data - giữ nguyên 100%
const mockRouteData = {
    tuyenDuongId: 1,
    maTuyen: "T001",
    tenTuyen: "Tuyến 1: Quận 1 - Quận 7",
    trangThai: "active",
    tongKhoangCach: "18.5 km",
    thoiGianUocTinh: "45 phút",
    stops: [
        {
            thuTu: 1,
            diemDung: {
                diemDungId: 1,
                tenDiemDung: "Điểm đón số 1",
                diaChi: "123 Đường Lê Lợi, Quận 1",
                vido: 10.7769,
                kinhdo: 106.7009
            },
            students: [
                { hocSinhId: 1, hoTen: "Nguyễn Văn A", maHS: "HS001" },
                { hocSinhId: 2, hoTen: "Trần Thị B", maHS: "HS002" }
            ],
            status: "pending",
            arrivalTime: null
        },
        {
            thuTu: 2,
            diemDung: {
                diemDungId: 2,
                tenDiemDung: "Điểm đón số 2",
                diaChi: "456 Đường Nguyễn Huệ, Quận 1",
                vido: 10.7739,
                kinhdo: 106.7019
            },
            students: [
                { hocSinhId: 3, hoTen: "Lê Văn C", maHS: "HS003" }
            ],
            status: "pending",
            arrivalTime: null
        },
        {
            thuTu: 3,
            diemDung: {
                diemDungId: 3,
                tenDiemDung: "Điểm đón số 3",
                diaChi: "789 Đường Hai Bà Trưng, Quận 3",
                vido: 10.7889,
                kinhdo: 106.6919
            },
            students: [
                { hocSinhId: 4, hoTen: "Phạm Thị D", maHS: "HS004" }
            ],
            status: "pending",
            arrivalTime: null
        },
        {
            thuTu: 4,
            diemDung: {
                diemDungId: 4,
                tenDiemDung: "Trường THPT XYZ",
                diaChi: "321 Đường Võ Văn Tần, Quận 3",
                vido: 10.7909,
                kinhdo: 106.6859
            },
            students: [],
            status: "pending",
            arrivalTime: null,
            isDestination: true
        }
    ]
};

export default function RoutesPage() {
    const navigate = useNavigate();
    const [route, setRoute] = useState(mockRouteData);
    const [currentStopIndex, setCurrentStopIndex] = useState(0);
    const [showStopDetails, setShowStopDetails] = useState(null);

    const handleCompleteStop = (stopIndex) => {
        setRoute(prev => ({
            ...prev,
            stops: prev.stops.map((stop, index) =>
                index === stopIndex
                    ? { ...stop, status: 'completed', arrivalTime: new Date().toISOString() }
                    : stop
            )
        }));

        if (stopIndex < route.stops.length - 1) {
            setCurrentStopIndex(stopIndex + 1);
        }
    };

    const handleNavigate = (address) => {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    const formatTime = (dateString) => {
        if (!dateString) return "--:--";
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const completedStops = route.stops.filter(s => s.status === 'completed').length;
    const totalStops = route.stops.length;
    const progressPercentage = (completedStops / totalStops) * 100;

    return (
        <div className="routes-container">
            {/* ĐÃ XÓA NÚT BACK - chỉ để lại tiêu đề */}
            <div className="routes-header">
                <div className="header-content">
                    <h1>Chi tiết tuyến đường</h1>
                    <p>Xem lộ trình và các điểm dừng được giao hôm nay</p>
                </div>
            </div>

            {/* Route Info Card */}
            <div className="route-info-card">
                <div className="route-header">
                    <div className="route-badge">
                        <Navigation size={48} strokeWidth={1.8} />
                        <div>
                            <h2>{route.tenTuyen}</h2>
                            <p className="route-code">Mã tuyến: {route.maTuyen}</p>
                        </div>
                    </div>
                    <span className={`status-badge ${route.trangThai}`}>
                        Đang hoạt động
                    </span>
                </div>

                <div className="route-stats">
                    <div className="stat-item">
                        <MapPin size={24} />
                        <div>
                            <span className="label">Khoảng cách</span>
                            <span className="value">{route.tongKhoangCach}</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <Clock size={24} />
                        <div>
                            <span className="label">Thời gian ước tính</span>
                            <span className="value">{route.thoiGianUocTinh}</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <BusIcon size={24} />
                        <div>
                            <span className="label">Tổng điểm dừng</span>
                            <span className="value">{totalStops}</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <Users size={24} />
                        <div>
                            <span className="label">Học sinh</span>
                            <span className="value">
                                {route.stops.reduce((acc, stop) => acc + stop.students.length, 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="route-progress">
                    <div className="progress-header">
                        <span>Tiến độ tuyến đường</span>
                        <span className="progress-text">{completedStops}/{totalStops} điểm dừng hoàn thành</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Stops List */}
            <div className="stops-section">
                <h3>Các điểm dừng</h3>
                <div className="stops-timeline">
                    {route.stops.map((stop, index) => (
                        <div
                            key={stop.diemDung.diemDungId}
                            className={`stop-card ${stop.status} ${index === currentStopIndex ? 'current' : ''}`}
                        >
                            <div className="timeline-wrapper">
                                <div className={`timeline-dot ${stop.status}`}>
                                    {stop.status === 'completed' ? (
                                        <CheckCircle size={28} strokeWidth={2.5} />
                                    ) : (
                                        <span>{stop.thuTu}</span>
                                    )}
                                </div>
                                {index < route.stops.length - 1 && (
                                    <div className={`timeline-line ${stop.status === 'completed' ? 'completed' : ''}`}></div>
                                )}
                            </div>

                            <div className="stop-content">
                                <div className="stop-header">
                                    <div className="stop-info">
                                        <h4>{stop.diemDung.tenDiemDung}</h4>
                                        <p className="stop-address">
                                            <MapPin size={16} />
                                            {stop.diemDung.diaChi}
                                        </p>
                                    </div>

                                    {stop.isDestination && (
                                        <span className="destination-badge">
                                            <School size={16} />
                                            Điểm đến
                                        </span>
                                    )}
                                </div>

                                {stop.students.length > 0 && (
                                    <div className="stop-students">
                                        <div className="students-header">
                                            <Users size={18} />
                                            <span>{stop.students.length} học sinh</span>
                                        </div>
                                        <div className="students-list">
                                            {stop.students.map(student => (
                                                <div key={student.hocSinhId} className="student-tag">
                                                    {student.hoTen}
                                                    <span className="student-id">{student.maHS}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="stop-actions">
                                    {stop.status === 'completed' && (
                                        <div className="completed-info">
                                            <CheckCircle size={18} />
                                            Đã hoàn thành lúc {formatTime(stop.arrivalTime)}
                                        </div>
                                    )}

                                    {stop.status === 'pending' && index === currentStopIndex && (
                                        <>
                                            <button
                                                className="btn-navigate"
                                                onClick={() => handleNavigate(stop.diemDung.diaChi)}
                                            >
                                                <Navigation size={16} />
                                                Dẫn đường
                                            </button>
                                            <button
                                                className="btn-complete"
                                                onClick={() => handleCompleteStop(index)}
                                            >
                                                <CheckCircle size={16} />
                                                Hoàn thành điểm dừng
                                            </button>
                                            <button
                                                className="btn-details"
                                                onClick={() => setShowStopDetails(stop)}
                                            >
                                                <Info size={16} />
                                                Chi tiết
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal chi tiết điểm dừng */}
            {showStopDetails && (
                <div className="modal-overlay" onClick={() => setShowStopDetails(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{showStopDetails.diemDung.tenDiemDung}</h3>
                            <button className="btn-close" onClick={() => setShowStopDetails(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4>Địa chỉ</h4>
                                <p>{showStopDetails.diemDung.diaChi}</p>
                            </div>

                            <div className="detail-section">
                                <h4>Tọa độ</h4>
                                <p>Vĩ độ: {showStopDetails.diemDung.vido}, Kinh độ: {showStopDetails.diemDung.kinhdo}</p>
                            </div>

                            {showStopDetails.students.length > 0 && (
                                <div className="detail-section">
                                    <h4>Học sinh tại điểm dừng ({showStopDetails.students.length})</h4>
                                    <div className="students-detail-list">
                                        {showStopDetails.students.map(student => (
                                            <div key={student.hocSinhId} className="student-detail-item">
                                                <div className="student-avatar-small">
                                                    {student.hoTen.charAt(0)}
                                                </div>
                                                <div className="student-detail-info">
                                                    <strong>{student.hoTen}</strong>
                                                    <span>{student.maHS}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="detail-actions">
                                <button
                                    className="btn-modal-action primary"
                                    onClick={() => handleNavigate(showStopDetails.diemDung.diaChi)}
                                >
                                    <Navigation size={18} />
                                    Mở bản đồ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}