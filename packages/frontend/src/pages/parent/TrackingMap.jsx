import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- CONFIG ICONS ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20]
});

const createIndexIcon = (number, isSchool = false) => {
    const bgColor = isSchool ? '#dc2626' : '#2563eb'; // Red for school, blue for stops
    const label = isSchool ? '🏫' : number;
    return L.divIcon({
        html: `<div style="background-color: ${bgColor}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${label}</div>`,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

// --- POLYLINE & MARKER LAYER COMPONENT ---
const PolylineMarkerLayer = ({ polylineCoords, routePoints, busData }) => {
    const map = useMap();
    const polylineRef = useRef(null);

    // Effect 1: Initial polyline render when coords loaded
    useEffect(() => {
        if (!map || !polylineCoords || polylineCoords.length < 2) {
            console.log("❌ [PolylineMarkerLayer] Missing data - map:", !!map, "coords:", polylineCoords?.length);
            return;
        }

        console.log(`✅ [PolylineMarkerLayer] Polyline data ready: ${polylineCoords.length} points`);

    }, [polylineCoords?.length]); // Only detect when coords array length changes

    // Effect 2: Real-time polyline update based on bus movement
    useEffect(() => {
        if (!map || !polylineCoords || polylineCoords.length < 2) return;
        if (!busData?.lat || !busData?.lng) return;

        const updatePolyline = () => {
            try {
                const busLat = busData.lat;
                const busLng = busData.lng;

                // Find closest point index on polyline to bus
                let closestIdx = 0;
                let minDist = Infinity;

                for (let i = 0; i < polylineCoords.length; i++) {
                    const coord = polylineCoords[i];
                    // coord is [lat, lng]
                    const latDiff = coord[0] - busLat;
                    const lngDiff = coord[1] - busLng;
                    const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

                    if (dist < minDist) {
                        minDist = dist;
                        closestIdx = i;
                    }
                }

                console.log(`🚌 Bus [${busLat.toFixed(5)}, ${busLng.toFixed(5)}] → Closest idx=${closestIdx}, dist=${minDist.toFixed(6)}`);

                // Get remaining polyline from closest point
                const remaining = polylineCoords.slice(closestIdx);

                if (remaining.length < 1) {
                    console.log("⚠️ No remaining polyline points");
                    return;
                }

                // Remove old polyline
                if (polylineRef.current) {
                    map.removeLayer(polylineRef.current);
                }

                // Draw new polyline with Canvas renderer
                const renderer = L.canvas();
                polylineRef.current = L.polyline(remaining, {
                    color: '#0284c7',
                    weight: 6,
                    opacity: 0.9,
                    lineCap: 'round',
                    lineJoin: 'round',
                    renderer: renderer
                }).addTo(map);

                console.log(`✂️  Polyline updated: ${remaining.length} points remaining (cut ${closestIdx})`);

            } catch (err) {
                console.error("❌ [PolylineMarkerLayer] Error:", err);
            }
        };

        updatePolyline();

    }, [map, polylineCoords?.length, busData?.lat, busData?.lng]); // Trigger on any bus movement

    return null;
};

// --- MAIN TRACKING MAP COMPONENT ---
const TrackingMap = ({ busData, routePoints, polyLineCoords }) => {
    const busPosition = useMemo(() =>
        busData ? [busData.lat, busData.lng] : [10.7716, 106.6995],
        [busData?.lat, busData?.lng]
    );

    const mapCenter = useMemo(() =>
        routePoints.length > 0 ? [routePoints[0].lat, routePoints[0].lng] : busPosition,
        [routePoints, busPosition]
    );

    const memoPolyLineCoords = useMemo(() => polyLineCoords, [polyLineCoords?.length]);

    console.log("🗺️ [TrackingMap] Rendering");
    console.log("   - busData:", busData?.lat, busData?.lng);
    console.log("   - routePoints:", routePoints.length);
    console.log("   - polyLineCoords:", polyLineCoords?.length);
    console.log("   - memoPolyLineCoords:", memoPolyLineCoords?.length);
    if (memoPolyLineCoords && memoPolyLineCoords.length > 0) {
        console.log("   - First 3 coords for Polyline:", memoPolyLineCoords.slice(0, 3));
        console.log("   - Last 3 coords for Polyline:", memoPolyLineCoords.slice(-3));
    }

    return (
        <div className="map-container" style={{ position: 'relative', zIndex: 0 }}>
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%', minHeight: '500px' }}
                scrollWheelZoom={true}
                key="simple-map"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* POLYLINE & MARKERS - CRITICAL COMPONENT */}
                {memoPolyLineCoords && memoPolyLineCoords.length > 0 && (
                    <PolylineMarkerLayer polylineCoords={memoPolyLineCoords} routePoints={routePoints} busData={busData} />
                )}

                {/* BUS MARKER */}
                {busData && (
                    <Marker position={busPosition} icon={busIcon} zIndexOffset={1000}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong>{busData.busInfo?.plate || "Xe buýt"}</strong>
                                <br />
                                <small>{busData.busInfo?.driver || "Tài xế"}</small>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* STOP MARKERS */}
                {routePoints && routePoints.length > 0 && routePoints.map((p, idx) => (
                    <Marker key={`stop-${idx}`} position={[p.lat, p.lng]} icon={createIndexIcon(idx + 1, false)}>
                        <Popup>
                            <strong>{p.name || `Trạm dừng ${idx + 1}`}</strong>
                            <br />
                            <small>{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</small>
                        </Popup>
                    </Marker>
                ))}

                {/* SCHOOL MARKER (RETURN POINT) */}
                <Marker
                    position={[10.762622, 106.660172]}
                    icon={createIndexIcon(null, true)}
                    zIndexOffset={500}
                >
                    <Popup>
                        <strong>🏫 Trường học (Điểm cuối)</strong>
                        <br />
                        <small>Quay lại trường sau khi trả hết học sinh</small>
                    </Popup>
                </Marker>

                {/* DEBUG INFO */}
                {(!memoPolyLineCoords || memoPolyLineCoords.length === 0) && routePoints.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '50px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            zIndex: 1000
                        }}
                    >
                        Đang tải lộ trình ({routePoints.length} điểm)...
                    </div>
                )}
            </MapContainer>
        </div>
    );
};

export default TrackingMap;
