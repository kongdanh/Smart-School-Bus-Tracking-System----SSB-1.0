import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/school-styles/school-routes.css";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SchoolRoutes() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const createIcon = (color, number) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 14px;">${number}</div>`,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  useEffect(() => {
    const fetchRoutesData = async () => {
      try {
        setLoading(true);

        const routeConfigs = [
          {
            id: "A1",
            name: "Route A1",
            description: "East District - City Center",
            color: "#10b981",
            coordinates: [
              [10.762622, 106.660172],
              [10.7685, 106.6825],
              [10.776889, 106.700806]
            ]
          },
          {
            id: "B2",
            name: "Route B2",
            description: "West District - City Center",
            color: "#f59e0b",
            coordinates: [
              [10.762622, 106.660172],
              [10.7565, 106.6705],
              [10.7685, 106.6825],
              [10.776889, 106.700806]
            ]
          },
          {
            id: "C3",
            name: "Route C3",
            description: "South District - City Center",
            color: "#3b82f6",
            coordinates: [
              [10.762622, 106.660172],
              [10.7585, 106.6705],
              [10.7645, 106.6805],
              [10.7705, 106.6905],
              [10.776889, 106.700806]
            ]
          }
        ];

        const routePromises = routeConfigs.map(async (config) => {
          try {
            const coordString = config.coordinates
              .map(coord => `${coord[1]},${coord[0]}`)
              .join(';');

            const res = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();

            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const routeCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

              return {
                ...config,
                stops: config.coordinates.length,
                status: Math.random() > 0.3 ? "active" : "stopped",
                statusText: Math.random() > 0.3 ? "Active" : "Stopped",
                routeCoordinates: routeCoords,
                distance: Math.round(route.distance / 1000),
                duration: Math.round(route.duration / 60),
                stopCoordinates: config.coordinates,
                students: Math.floor(Math.random() * 35 + 15),
                buses: Math.floor(Math.random() * 2 + 1)
              };
            }
          } catch (err) {
            console.error(`Error loading route ${config.name}:`, err);
            return {
              ...config,
              stops: config.coordinates.length,
              status: "error",
              statusText: "Error",
              routeCoordinates: config.coordinates,
              stopCoordinates: config.coordinates,
              distance: 0,
              duration: 0,
              students: 0,
              buses: 0
            };
          }
        });

        const fetchedRoutes = await Promise.all(routePromises);
        setRoutes(fetchedRoutes);
      } catch (err) {
        console.error("Error loading routes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutesData();
  }, []);

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="school-routes-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Loading routes...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="school-routes-container">
      {/* Header */}
      <div className="routes-header">
        <div className="header-content">
          <h1>Route Management</h1>
          <p className="routes-subtitle">View and manage bus routes with real-time data</p>
        </div>
        <div className="header-actions">
          <button className="btn-add" onClick={() => navigate('/school/add-route')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Route
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="routes-search">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="routes-content">
        {/* Routes List */}
        <div className="routes-list">
          <h3>All Routes ({filteredRoutes.length})</h3>
          <div className="route-items">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className={`route-item ${route.status} ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="route-item-header">
                  <div className="route-color" style={{ backgroundColor: route.color }}></div>
                  <div className="route-info">
                    <h4>{route.name}</h4>
                    <p>{route.description}</p>
                  </div>
                </div>

                <div className="route-stats">
                  <div className="route-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{route.stops} stops</span>
                  </div>
                  <div className="route-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{route.students} students</span>
                  </div>
                </div>

                {route.distance > 0 && (
                  <div className="route-details">
                    <span>📏 {route.distance}km</span>
                    <span>⏱️ {route.duration} mins</span>
                    <span className={`status-badge ${route.status}`}>
                      <span className="status-dot"></span>
                      {route.statusText}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="route-map-container">
          <div className="map-header">
            <h3>Route Map</h3>
            {selectedRoute && (
              <div className="selected-route-info">
                <div className="route-color-indicator" style={{ backgroundColor: selectedRoute.color }}></div>
                <span>{selectedRoute.name}</span>
              </div>
            )}
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={[10.762622, 106.660172]}
              zoom={12}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {routes.map((route) => (
                <React.Fragment key={route.id}>
                  {route.routeCoordinates && route.routeCoordinates.length > 0 && (
                    <Polyline
                      positions={route.routeCoordinates}
                      pathOptions={{
                        color: selectedRoute?.id === route.id ? route.color : '#cccccc',
                        weight: selectedRoute?.id === route.id ? 5 : 3,
                        opacity: selectedRoute?.id === route.id ? 1 : 0.5
                      }}
                    />
                  )}

                  {route.stopCoordinates && route.stopCoordinates.map((coord, stopIndex) => (
                    <Marker
                      key={`${route.id}-stop-${stopIndex}`}
                      position={coord}
                      icon={createIcon(route.color, stopIndex + 1)}
                    >
                      <Popup>
                        <div className="map-popup">
                          <h4>{route.name}</h4>
                          <p>Stop {stopIndex + 1}</p>
                          <div className="popup-info">
                            <span>Status: {route.statusText}</span>
                            {route.distance > 0 && (
                              <span>{route.distance}km • {route.duration} mins</span>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}