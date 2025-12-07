import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { toast } from 'react-toastify';
import schoolService from '../../services/schoolService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    MapPin,
    Search,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Navigation
} from 'lucide-react';
import '../../styles/school-styles/school-routes.css'; // Reuse styles for now

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, setAddress }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            // Reverse geocoding could go here
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position} draggable={true} eventHandlers={{
            dragend: (e) => {
                setPosition(e.target.getLatLng());
            }
        }}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
};

const Stops = () => {
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStop, setEditingStop] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        tenDiemDung: '',
        diaChi: '',
        vido: 10.8231,
        kinhdo: 106.6297
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchStops();
    }, []);

    const fetchStops = async () => {
        try {
            setLoading(true);
            const res = await schoolService.getAllStops();
            setStops(res.data || []);
        } catch (error) {
            console.error("Error fetching stops:", error);
            toast.error("Failed to load stops");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                setFormData(prev => ({
                    ...prev,
                    vido: parseFloat(lat),
                    kinhdo: parseFloat(lon),
                    diaChi: display_name
                }));
            } else {
                toast.warning("Location not found");
            }
        } catch (error) {
            toast.error("Search failed");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStop) {
                await schoolService.updateStop(editingStop.diemDungId, formData);
                toast.success("Stop updated successfully");
            } else {
                await schoolService.createStop(formData);
                toast.success("Stop created successfully");
            }
            setIsModalOpen(false);
            fetchStops();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this stop?")) {
            try {
                await schoolService.deleteStop(id);
                toast.success("Stop deleted");
                fetchStops();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete stop");
            }
        }
    };

    const openModal = (stop = null) => {
        if (stop) {
            setEditingStop(stop);
            setFormData({
                tenDiemDung: stop.tenDiemDung,
                diaChi: stop.diaChi || '',
                vido: stop.vido || 10.8231,
                kinhdo: stop.kinhdo || 106.6297
            });
            setSearchQuery(stop.diaChi || '');
        } else {
            setEditingStop(null);
            setFormData({
                tenDiemDung: '',
                diaChi: '',
                vido: 10.8231,
                kinhdo: 106.6297
            });
            setSearchQuery('');
        }
        setIsModalOpen(true);
    };

    return (
        <div className="school-routes-container">
            <div className="routes-header">
                <div>
                    <h1>Stop Management</h1>
                    <p>Manage bus stops and locations</p>
                </div>
                <button className="btn-primary" onClick={() => openModal()}>
                    <Plus size={20} /> Add New Stop
                </button>
            </div>

            <div className="routes-content">
                <div className="routes-list-view" style={{ maxWidth: '400px', borderRight: '1px solid #e2e8f0' }}>
                    <div className="search-bar">
                        <Search size={18} color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search stops..."
                            onChange={(e) => {
                                // Implement local filter if needed
                            }}
                        />
                    </div>

                    <div className="stops-list" style={{ marginTop: '20px' }}>
                        {stops.map(stop => (
                            <div key={stop.diemDungId} className="route-card" style={{ padding: '16px' }}>
                                <div className="route-card-header">
                                    <div className="route-icon">
                                        <MapPin size={20} color="#2563eb" />
                                    </div>
                                    <div className="route-info">
                                        <h3>{stop.tenDiemDung}</h3>
                                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{stop.diaChi}</p>
                                    </div>
                                    <div className="route-actions">
                                        <button className="action-btn edit" onClick={() => openModal(stop)}>
                                            <Edit size={16} />
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(stop.diemDungId)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="routes-map-view">
                    <MapContainer
                        center={[10.8231, 106.6297]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        {stops.map(stop => (
                            stop.vido && stop.kinhdo && (
                                <Marker
                                    key={stop.diemDungId}
                                    position={[stop.vido, stop.kinhdo]}
                                >
                                    <Popup>
                                        <b>{stop.tenDiemDung}</b><br />
                                        {stop.diaChi}
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal">
                        <div className="modal-header">
                            <h2>{editingStop ? 'Edit Stop' : 'Add New Stop'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="route-form" style={{ flexDirection: 'row', height: '500px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Stop Name</label>
                                    <input
                                        type="text"
                                        value={formData.tenDiemDung}
                                        onChange={(e) => setFormData({ ...formData, tenDiemDung: e.target.value })}
                                        placeholder="e.g. School Gate A"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address Search</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Enter address..."
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <button
                                            className="btn-secondary"
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                        >
                                            {isSearching ? '...' : <Search size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Address (Display)</label>
                                    <input
                                        type="text"
                                        value={formData.diaChi}
                                        onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                                    />
                                </div>

                                <div className="coords-inputs">
                                    <div className="form-group">
                                        <label>Latitude</label>
                                        <input
                                            type="number"
                                            value={formData.vido}
                                            onChange={(e) => setFormData({ ...formData, vido: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Longitude</label>
                                        <input
                                            type="number"
                                            value={formData.kinhdo}
                                            onChange={(e) => setFormData({ ...formData, kinhdo: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions" style={{ marginTop: 'auto' }}>
                                    <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button className="btn-primary" onClick={handleSubmit}>
                                        <Save size={18} /> Save Stop
                                    </button>
                                </div>
                            </div>

                            <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden' }}>
                                <MapContainer
                                    center={[formData.vido, formData.kinhdo]}
                                    zoom={15}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker
                                        position={{ lat: formData.vido, lng: formData.kinhdo }}
                                        setPosition={(pos) => setFormData({ ...formData, vido: pos.lat, kinhdo: pos.lng })}
                                    />
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stops;
