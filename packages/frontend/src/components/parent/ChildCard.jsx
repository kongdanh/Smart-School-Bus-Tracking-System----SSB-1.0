import React from 'react';
import '../../pages/parent/styles/ChildCard.css';

const ChildCard = ({ child }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'On Bus': return '#ffa500';
            case 'Arrived': return '#00d4aa';
            default: return '#888';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'On Bus': return '🚌';
            case 'Arrived': return '✓';
            default: return '•';
        }
    };

    return (
        <div className="child-card">
            <div className="child-info">
                <h3 className="child-name">{child.name}</h3>
                <div className="child-status" style={{ color: getStatusColor(child.status) }}>
                    <span className="status-icon">{getStatusIcon(child.status)}</span>
                    <span className="status-text">{child.status}</span>
                </div>
                <p className="child-update">{child.lastUpdate}</p>
            </div>
        </div>
    );
};

export default ChildCard;
