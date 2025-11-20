import React from 'react';
import '../../pages/parent/styles/TripStatusCard.css';

const TripStatusCard = ({ tripStatus }) => {
    return (
        <div className="trip-status-card">
            <h2>Trip Status</h2>
            <div className="status-item">
                <label>Pickup Time</label>
                <div className="status-value">{tripStatus.pickupTime}</div>
            </div>
            <div className="status-item">
                <label>Estimated Arrival</label>
                <div className="status-value">{tripStatus.estimatedArrival}</div>
            </div>
            <button className="btn-message">💬 Message Support</button>
            <button className="btn-report">⚠️ Report Issue</button>
            <div className="stats-row">
                <div className="stat">
                    <span className="stat-value">98%</span>
                    <span className="stat-label">On-Time Rate</span>
                </div>
                <div className="stat">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Total Trips</span>
                </div>
            </div>
        </div>
    );
};

export default TripStatusCard;
