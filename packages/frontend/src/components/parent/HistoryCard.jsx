import React from 'react';
import '../../pages/parent/styles/HistoryCard.css';

const HistoryCard = ({ trip }) => {
    return (
        <div className="history-card">
            <div className="history-day">{trip.day}</div>
            <div className="history-date">{trip.date}</div>
            <div className="history-time">🕐 {trip.time}</div>
            <div className={`history-status ${trip.status}`}>
                <span className="status-dot"></span>
                {trip.status}
            </div>
        </div>
    );
};

export default HistoryCard;
