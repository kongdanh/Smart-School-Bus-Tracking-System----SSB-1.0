import React, { useState } from 'react';
import '../../styles/parent-styles/parent-tracking.css';

const Tracking = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students] = useState([
        {
            id: 1,
            name: 'Nguyễn Minh A',
            class: 'Class 5A',
            status: 'on-bus',
            busNumber: '29B-12345',
            driver: 'Nguyễn Văn An',
            eta: '5 mins',
            location: 'Đường Nguyễn Hữu Cảnh'
        },
        {
            id: 2,
            name: 'Trần Thị B',
            class: 'Class 4B',
            status: 'waiting',
            busNumber: '29B-12346',
            driver: 'Trần Văn Bình',
            eta: '10 mins',
            location: 'School Pickup Point'
        },
        {
            id: 3,
            name: 'Lê Văn C',
            class: 'Class 3A',
            status: 'home',
            busNumber: '-',
            driver: '-',
            eta: '-',
            location: 'Home Address'
        }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'on-bus': return 'status-on-bus';
            case 'waiting': return 'status-waiting';
            case 'home': return 'status-home';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'on-bus': return 'On Bus';
            case 'waiting': return 'Waiting';
            case 'home': return 'Home';
            default: return status;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'on-bus':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                );
            case 'waiting':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                );
            case 'home':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                );
            default:
                return null;
        }
    };

    if (selectedStudent) {
        return (
            <div className="tracking-detail-container">
                <div className="detail-header">
                    <button onClick={() => setSelectedStudent(null)} className="btn-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back
                    </button>
                    <div className="detail-title">
                        <h2>{selectedStudent.name}</h2>
                        <span className={`status-badge ${getStatusColor(selectedStudent.status)}`}>
                            <span className="status-dot"></span>
                            {getStatusText(selectedStudent.status)}
                        </span>
                    </div>
                    <button className="btn-refresh">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        Refresh
                    </button>
                </div>

                <div className="map-container">
                    <div className="map-placeholder">
                        <div className="map-pin">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <p className="map-title">Live Map - Integration Area</p>
                        <p className="map-subtitle">
                            Bus: {selectedStudent.busNumber} • Driver: {selectedStudent.driver}
                        </p>
                        <div className="map-status">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{selectedStudent.location}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-info-grid">
                    <div className="info-card">
                        <div className="info-icon student">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h3>Student Info</h3>
                        <div className="info-item">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{selectedStudent.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Class:</span>
                            <span className="info-value">{selectedStudent.class}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Status:</span>
                            <span className={`status-badge small ${getStatusColor(selectedStudent.status)}`}>
                                {getStatusText(selectedStudent.status)}
                            </span>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon bus">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                        </div>
                        <h3>Bus Info</h3>
                        <div className="info-item">
                            <span className="info-label">Bus Number:</span>
                            <span className="info-value">{selectedStudent.busNumber}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Driver:</span>
                            <span className="info-value">{selectedStudent.driver}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">ETA:</span>
                            <span className="info-value eta">{selectedStudent.eta}</span>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon route">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="6" cy="19" r="3" />
                                <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                                <circle cx="18" cy="5" r="3" />
                            </svg>
                        </div>
                        <h3>Route Info</h3>
                        <div className="info-item">
                            <span className="info-label">Current Location:</span>
                            <span className="info-value">{selectedStudent.location}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Next Stop:</span>
                            <span className="info-value">School Main Gate</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Distance:</span>
                            <span className="info-value">2.5 km</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <div className="header-content-tracking">
                    <h1>Live Tracking</h1>
                    <p className="tracking-subtitle">Select a student to track their location in real-time</p>
                </div>
                <div className="header-stats">
                    <div className="stat-pill">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                        <span>{students.filter(s => s.status === 'on-bus').length} On Bus</span>
                    </div>
                </div>
            </div>

            <div className="students-grid">
                {students.map(student => (
                    <div
                        key={student.id}
                        className="student-card"
                        onClick={() => setSelectedStudent(student)}
                    >
                        <div className="card-header">
                            <div className="student-avatar">
                                {student.name.charAt(0)}
                            </div>
                            <div className={`status-indicator ${getStatusColor(student.status)}`}>
                                {getStatusIcon(student.status)}
                            </div>
                        </div>

                        <div className="card-content">
                            <h3>{student.name}</h3>
                            <p className="student-class">{student.class}</p>

                            <div className={`status-badge ${getStatusColor(student.status)}`}>
                                <span className="status-dot"></span>
                                {getStatusText(student.status)}
                            </div>

                            <div className="card-location">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{student.location}</span>
                            </div>
                        </div>

                        <button className="btn-view-route">
                            <span>View Route</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracking;