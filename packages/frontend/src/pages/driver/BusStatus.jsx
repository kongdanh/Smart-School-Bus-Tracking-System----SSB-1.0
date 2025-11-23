import React from 'react';
import '../../styles/driver-styles/driver-bus-status.css';

const BusStatus = () => {
    return (
        <div className="bus-status-page">
            {/* UPDATED HEADER - Consistent */}
            <div className="page-header-consistent">
                <div className="header-left">
                    <h1>Trạng Thái Xe Buýt</h1>
                    <p className="page-subtitle">Theo dõi thông tin và hành trình xe buýt</p>
                </div>
                <div className="status-indicator live">
                    <span className="pulse"></span>
                    Đang hoạt động
                </div>
            </div>

            <div className="bus-info-grid">
                <div className="info-card">
                    <div className="card-icon">🚌</div>
                    <h3>Biển số</h3>
                    <p className="value">51B-123.45</p>
                </div>
                <div className="info-card">
                    <div className="card-icon">⚡</div>
                    <h3>Tốc độ hiện tại</h3>
                    <p className="value">48 km/h</p>
                </div>
                <div className="info-card">
                    <div className="card-icon">📍</div>
                    <h3>Vị trí</h3>
                    <p className="value">Q.7, TP.HCM</p>
                </div>
                <div className="info-card">
                    <div className="card-icon">⛽</div>
                    <h3>Nhiên liệu</h3>
                    <p className="value">78%</p>
                </div>
            </div>

            <div className="status-detail">
                <h2>Chi tiết hành trình hôm nay</h2>
                <div className="timeline">
                    <div className="timeline-item done">✓ 6:30 - Khởi hành từ bãi</div>
                    <div className="timeline-item done">✓ 6:45 - Đón học sinh điểm 1</div>
                    <div className="timeline-item active">🚌 7:15 - Đang di chuyển đến trường</div>
                    <div className="timeline-item">⏱ 7:45 - Dự kiến đến trường</div>
                </div>
            </div>
        </div>
    );
};

export default BusStatus;