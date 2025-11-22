import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/school-styles/school-tracking.css";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SchoolTracking() {
  const [selectedBus, setSelectedBus] = useState(null);
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const createBusIcon = (status, heading = 0) => {
    const color = status === 'moving' ? '#10b981' : '#f59e0b';
    return L.divIcon({
      html: `
        <div style="transform: rotate(${heading}deg); transition: transform 0.3s ease;">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17" fill="white" opacity="0.9"/>
            <rect x="8" y="10" width="20" height="16" rx="3" fill="${color}" stroke="white" stroke-width="2"/>
            <rect x="10" y="12" width="4" height="3" fill="white" opacity="0.8"/>
            <rect x="16" y="12" width="4" height="3" fill="white" opacity="0.8"/>
            <rect x="22" y="12" width="4" height="3" fill="white" opacity="0.8"/>
            <circle cx="12" cy="22" r="2" fill="#333"/>
            <circle cx="24" cy="22" r="2" fill="#333"/>
            <polygon points="18,8 20,10 16,10" fill="${color}"/>
          </svg>
        </div>
      `,
      className: 'custom-bus-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  };

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);

        const routeConfigs = [
          {
            id: "A1",
            name: "Route A1",
            busId: "29B-12345",
            driver: "Nguyễn Văn An",
            color: "#10b981",
            coordinates: [[10.762622, 106.660172], [10.7685, 106.6825], [10.776889, 106.700806]]
          },
          {
            id: "B2",
            name: "Route B2",
            busId: "29B-67890",
            driver: "Lê Văn Bình",
            color: "#f59e0b",
            coordinates: [[10.762622, 106.660172], [10.7565, 106.6705], [10.7685, 106.6825], [10.776889, 106.700806]]
          },
          {
            id: "C3",
            name: "Route C3",
            busId: "29B-11111",
            driver: "Trần Văn Cường",
            color: "#3b82f6",
            coordinates: [[10.762622, 106.660172], [10.7585, 106.6705], [10.7645, 106.6805], [10.7705, 106.6905], [10.776889, 106.700806]]
          }
        ];

        const trackingPromises = routeConfigs.map(async (config) => {
          const currentCoordIndex = Math.floor(Math.random() * config.coordinates.length);
          const currentCoord = config.coordinates[currentCoordIndex];
          const status = Math.random() > 0.3 ? "moving" : "stopped";

          return {
            busId: config.busId,
            route: config.name,
            driver: config.driver,
            status: status,
            statusText: status === "moving" ? "Moving" : "Stopped",
            speed: status === "moving" ? `${Math.floor(Math.random() * 40 + 20)} km/h` : "0 km/h",
            students: Math.floor(Math.random() * 35 + 15),
            coordinates: currentCoord,
            heading: Math.floor(Math.random() * 360),
            color: config.color,
            nextStop: currentCoordIndex < config.coordinates.length - 1 ? "Next stop in 5 mins" : "Final stop",
            battery: Math.floor(Math.random() * 30 + 70),
            lastUpdate: "Just now"
          };
        });

        const fetchedTracking = await Promise.all(trackingPromises);
        setTrackingData(fetchedTracking);
      } catch (err) {
        console.error("Error loading tracking data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();

    // Auto refresh every 10 seconds
    const interval = setInterval(fetchTrackingData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredBuses = trackingData.filter(bus => {
    if (filterStatus === 'all') return true;
    return bus.status === filterStatus;
  });

  const movingCount = trackingData.filter(b => b.status === 'moving').length;
  const stoppedCount = trackingData.filter(b => b.status === 'stopped').length;

  if (loading) {
    return (
      <div className="school-tracking-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Loading tracking data...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="school-tracking-container">
      {/* Header */}
      <div className="tracking-header">
        <div className="header-content">
          <h1>Live Bus Tracking</h1>
          <p className="tracking-subtitle">Monitor all buses in real-time</p>
        </div>
        <div className="header-stats-pills">
          <div className="stat-pill moving">
            <span className="pill-dot"></span>
            <span>{movingCount} Moving</span>
          </div>
          <div className="stat-pill stopped">
            <span className="pill-dot"></span>
            <span>{stoppedCount} Stopped</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="tracking-filters">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All Buses
        </button>
        <button
          className={`filter-btn ${filterStatus === 'moving' ? 'active' : ''}`}
          onClick={() => setFilterStatus('moving')}
        >
          Moving
        </button>
        <button
          className={`filter-btn ${filterStatus === 'stopped' ? 'active' : ''}`}
          onClick={() => setFilterStatus('stopped')}
        >
          Stopped
        </button>
      </div>

      {/* Content */}
      <div className="tracking-content">
        {/* Map */}
        <div className="tracking-map-container">
          <div className="map-header">
            <h3>Live Map</h3>
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-dot moving"></div>
                <span>Moving</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot stopped"></div>
                <span>Stopped</span>
              </div>
            </div>
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={[10.762622, 106.660172]}
              zoom={13}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredBuses.map((bus) => (
                <Marker
                  key={bus.busId}
                  position={bus.coordinates}
                  icon={createBusIcon(bus.status, bus.heading)}
                >
                  <Popup>
                    <div className="map-popup">
                      <h4>{bus.busId}</h4>
                      <div className="popup-info">
                        <div className="popup-row">
                          <span>Route:</span>
                          <strong>{bus.route}</strong>
                        </div>
                        <div className="popup-row">
                          <span>Driver:</span>
                          <strong>{bus.driver}</strong>
                        </div>
                        <div className="popup-row">
                          <span>Speed:</span>
                          <strong style={{ color: bus.status === 'moving' ? '#10b981' : '#f59e0b' }}>
                            {bus.speed}
                          </strong>
                        </div>
                        <div className="popup-row">
                          <span>Students:</span>
                          <strong>{bus.students}</strong>
                        </div>
                        <div className="popup-row">
                          <span>Status:</span>
                          <span className={`status-badge ${bus.status}`}>
                            {bus.statusText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Bus List */}
        <div className="tracking-list">
          <div className="list-header">
            <h3>Buses ({filteredBuses.length})</h3>
          </div>

          <div className="bus-tracking-items">
            {filteredBuses.map((bus) => (
              <div
                key={bus.busId}
                className={`tracking-item ${bus.status} ${selectedBus === bus.busId ? 'selected' : ''}`}
                onClick={() => setSelectedBus(bus.busId)}
              >
                <div className="tracking-item-header">
                  <div className="bus-id-badge" style={{ borderColor: bus.color }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span>{bus.busId}</span>
                  </div>
                  <span className={`status-badge ${bus.status}`}>
                    <span className="status-dot"></span>
                    {bus.statusText}
                  </span>
                </div>

                <div className="tracking-item-body">
                  <div className="info-row">
                    <span className="info-label">Route:</span>
                    <span className="info-value">{bus.route}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Driver:</span>
                    <span className="info-value">{bus.driver}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Speed:</span>
                    <span className="info-value" style={{ color: bus.status === 'moving' ? '#10b981' : '#64748b' }}>
                      {bus.speed}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Students:</span>
                    <span className="info-value">{bus.students}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Next:</span>
                    <span className="info-value">{bus.nextStop}</span>
                  </div>
                </div>

                <div className="tracking-item-footer">
                  <div className="battery-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
                      <line x1="23" y1="13" x2="23" y2="11" />
                    </svg>
                    <span>{bus.battery}%</span>
                  </div>
                  <span className="last-update">{bus.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}