import React, { useState } from 'react';
import '../../styles/parent-history.css';

const History = () => {
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [trips] = useState([
        { id: 1, date: '2024-01-15', day: 'Monday', startTime: '08:10', endTime: '08:35', route: 'Route A1', bus: '29B-12345', driver: 'Nguyễn Văn An', status: 'completed' },
        { id: 2, date: '2024-01-14', day: 'Sunday', startTime: '08:15', endTime: '08:40', route: 'Route A1', bus: '29B-12345', driver: 'Nguyễn Văn An', status: 'completed' },
        { id: 3, date: '2024-01-13', day: 'Saturday', startTime: '08:05', endTime: '08:30', route: 'Route A1', bus: '29B-12345', driver: 'Nguyễn Văn An', status: 'completed' }
    ]);

    const [stats] = useState({
        totalTrips: 22,
        onTime: 100,
        totalKm: 275,
        avgDuration: 8.3
    });

    return (
        <div className="history-container">
            <div className="history-header">
                <h1>Trip History</h1>
                <p className="history-subtitle">View detailed trip records</p>
            </div>

            <div className="history-filters">
                {[
                    { label: 'All', value: 'all' },
                    { label: '7 Days', value: 'week' },
                    { label: '1 Month', value: 'month' }
                ].map(filter => (
                    <button
                        key={filter.value}
                        className={`filter-btn ${filterPeriod === filter.value ? 'active' : ''}`}
                        onClick={() => setFilterPeriod(filter.value)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="history-content">
                <div className="history-left">
                    <div className="trips-table-wrapper">
                        <table className="trips-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Day</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Route</th>
                                    <th>Bus</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.map(trip => (
                                    <tr key={trip.id}>
                                        <td>{new Date(trip.date).toLocaleDateString('vi-VN')}</td>
                                        <td>{trip.day}</td>
                                        <td>{trip.startTime}</td>
                                        <td>{trip.endTime}</td>
                                        <td>{trip.route}</td>
                                        <td className="bus-code">{trip.bus}</td>
                                        <td>{trip.driver}</td>
                                        <td><span className={`status-${trip.status}`}>{trip.status === 'completed' ? '✓ Completed' : '✗ Pending'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="history-right">
                    <div className="stats-panel">
                        <h3>Monthly Stats</h3>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <div className="stat-value">{stats.totalTrips}</div>
                                <div className="stat-label">Total Trips</div>
                            </div>
                            <div className="stat-box highlight">
                                <div className="stat-value">{stats.onTime}%</div>
                                <div className="stat-label">On Time</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{stats.totalKm}</div>
                                <div className="stat-label">Total km</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{stats.avgDuration}</div>
                                <div className="stat-label">Avg Duration</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
