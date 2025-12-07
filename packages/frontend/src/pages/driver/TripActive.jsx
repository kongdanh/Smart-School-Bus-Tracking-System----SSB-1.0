import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import tripService from '../../services/tripService';
import socketService from '../../services/socket';
import '../../styles/driver-styles/driver-routes.css'; // Reuse styles

// Fix Leaflet icons
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
    iconPopupAnchor: [0, -20]
});

// Component to update map center
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

// Helper to calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const TripActive = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tripData, setTripData] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const socketRef = useRef(null);
    const lastLocationRef = useRef(null);

    useEffect(() => {
        if (tripData?.currentTrip?.lichTrinhId) {
            const socket = socketService.getSocket();
            socket.emit('join_trip_room', tripData.currentTrip.lichTrinhId);
        }
    }, [tripData]);

    useEffect(() => {
        fetchActiveTrip();

        // Connect socket
        socketRef.current = socketService.getSocket();

        // Listen for location updates
        socketRef.current.on('BUS_LOCATION_UPDATE', (data) => {
            console.log('Bus location update:', data);
            if (data && data.lat && data.lng) {
                const newLocation = { lat: data.lat, lng: data.lng };

                if (lastLocationRef.current) {
                    const dist = calculateDistance(
                        lastLocationRef.current.lat,
                        lastLocationRef.current.lng,
                        newLocation.lat,
                        newLocation.lng
                    );
                    // Only add if distance is reasonable (e.g. > 5 meters to avoid jitter)
                    if (dist > 0.005) {
                        setTotalDistance(prev => prev + dist);
                        lastLocationRef.current = newLocation;
                    }
                } else {
                    lastLocationRef.current = newLocation;
                }

                setBusLocation(newLocation);
            }
        });

        // Listen for notifications
        socketRef.current.on('NEW_NOTIFICATION', (data) => {
            toast.info(data.message);
            setNotifications(prev => [data, ...prev]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off('BUS_LOCATION_UPDATE');
                socketRef.current.off('NEW_NOTIFICATION');
            }
        };
    }, []);

    const fetchActiveTrip = async () => {
        try {
            setLoading(true);
            const response = await tripService.getDriverDashboard();
            if (response.success && response.data.currentTrip) {
                setTripData(response.data);
                // Set initial location if available (e.g. from first stop or previous location)
                // For now, default to HCMC or first stop
                const firstStop = response.data.currentTrip.tuyenduong?.tuyenduong_diemdung?.[0]?.diemdung;
                let initialLoc = { lat: 10.762622, lng: 106.660172 }; // Default HCMC

                if (firstStop) {
                    initialLoc = { lat: firstStop.vido, lng: firstStop.kinhdo };
                }

                setBusLocation(initialLoc);
                lastLocationRef.current = initialLoc;

            } else {
                toast.warning('Không có chuyến xe đang hoạt động');
                navigate('/driver/dashboard');
            }
        } catch (error) {
            console.error('Error fetching trip:', error);
            toast.error('Lỗi khi tải thông tin chuyến xe');
            navigate('/driver/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleEndTrip = async () => {
        if (!tripData?.tripRecordId) return;

        if (window.confirm(`Bạn có chắc chắn muốn kết thúc chuyến xe? Tổng quãng đường: ${totalDistance.toFixed(2)} km`)) {
            try {
                await tripService.endTrip(tripData.tripRecordId, parseFloat(totalDistance.toFixed(2)));
                toast.success('Đã kết thúc chuyến xe');
                navigate('/driver/dashboard');
            } catch (error) {
                console.error('Error ending trip:', error);
                toast.error('Lỗi khi kết thúc chuyến xe');
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!tripData) return null;

    const { currentTrip } = tripData;

    return (
        <div className="trip-active-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="trip-header" style={{ padding: '1rem', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2>Đang di chuyển: {currentTrip.tuyenduong?.tenTuyen}</h2>
                        <p>Xe: {tripData.bus?.bienSo} - {tripData.bus?.maXe}</p>
                        <p>Quãng đường: <strong>{totalDistance.toFixed(2)} km</strong></p>
                    </div>
                    <button
                        onClick={handleEndTrip}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Kết thúc chuyến
                    </button>
                </div>
            </div>

            <div className="map-container" style={{ flex: 1, position: 'relative' }}>
                {busLocation && (
                    <MapContainer
                        center={[busLocation.lat, busLocation.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker position={[busLocation.lat, busLocation.lng]} icon={busIcon}>
                            <Popup>
                                Xe đang ở đây
                            </Popup>
                        </Marker>
                        <MapUpdater center={[busLocation.lat, busLocation.lng]} />

                        {/* Draw stops */}
                        {currentTrip.tuyenduong?.tuyenduong_diemdung?.map((stop, index) => (
                            <Marker
                                key={stop.diemDungId}
                                position={[stop.diemdung.vido, stop.diemdung.kinhdo]}
                            >
                                <Popup>{stop.diemdung.tenDiemDung}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>

            {/* Notifications Overlay */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
                maxWidth: '300px',
                maxHeight: '200px',
                overflowY: 'auto'
            }}>
                {notifications.map((notif, idx) => (
                    <div key={idx} style={{
                        background: 'rgba(255,255,255,0.9)',
                        padding: '10px',
                        marginBottom: '5px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {notif.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TripActive;
