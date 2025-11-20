import React from 'react';
import '../../pages/parent/styles/MapView.css';

const MapView = () => {
    return (
        <div className="map-view">
            <div className="map-placeholder">
                <svg viewBox="0 0 300 300" width="100%" height="100%">
                    <circle cx="150" cy="150" r="100" fill="rgba(0, 150, 255, 0.1)" stroke="#0096ff" strokeWidth="2" />
                    <circle cx="150" cy="150" r="8" fill="#0096ff" />
                    <path d="M 150 150 L 150 80" stroke="#0096ff" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>
                <div className="map-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
                    </svg>
                    <p>Live Map Integration Area</p>
                </div>
            </div>
        </div>
    );
};

export default MapView;
