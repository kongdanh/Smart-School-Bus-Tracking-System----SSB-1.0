import React from 'react';
import '../../pages/parent/styles/BusInfoCard.css';

const BusInfoCard = ({ busInfo }) => {
    return (
        <div className="bus-info-card">
            <h3>Bus Information</h3>
            <div className="info-item">
                <label>Student</label>
                <span>{busInfo.student}</span>
            </div>
            <div className="info-item">
                <label>Bus Number</label>
                <span>{busInfo.busNumber}</span>
            </div>
            <div className="info-item">
                <label>Driver</label>
                <span>{busInfo.driver}</span>
            </div>
            <div className="status-box">
                <h4>Current Status</h4>
                <div className="status-indicator">
                    <span className="status-dot on-route"></span>
                    <span>{busInfo.status}</span>
                </div>
                <div className="status-detail">
                    <label>Speed</label>
                    <span>{busInfo.speed}</span>
                </div>
            </div>
        </div>
    );
};

export default BusInfoCard;
