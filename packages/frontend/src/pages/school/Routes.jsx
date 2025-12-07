import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import schoolService from "../../services/schoolService";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/school-styles/school-routes.css";
import {
  Map as MapIcon,
  List,
  Plus,
  Search,
  MapPin,
  Trash2,
  Edit,
  Save,
  X,
  Navigation
} from "lucide-react";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks for adding stops
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default function SchoolRoutes() {
  // View State
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  // Data State
  const [routes, setRoutes] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    maTuyen: '',
    tenTuyen: '',
    stops: []
  });

  const mapRef = useRef(null);

  useEffect(() => {
    fetchRoutes();
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      const response = await schoolService.getAllStops();
      if (response.success) {
        setAvailableStops(response.data);
      }
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getAllRoutes();
      if (response.success) {
        setRoutes(response.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setEditingRoute(null);
    setFormData({
      maTuyen: `RT-${Date.now().toString().slice(-6)}`,
      tenTuyen: '',
      stops: []
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (route) => {
    setEditingRoute(route);
    setFormData({
      maTuyen: route.maTuyen,
      tenTuyen: route.tenTuyen,
      stops: route.tuyenduong_diemdung?.map(td => ({
        ...td.diemdung,
        diemDungId: td.diemDungId,
        tempId: Date.now() + Math.random() // for key
      })) || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await schoolService.deleteRoute(id);
        toast.success("Route deleted");
        fetchRoutes();
      } catch (error) {
        toast.error("Failed to delete route");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, {
        tempId: Date.now(),
        tenDiemDung: `Stop ${prev.stops.length + 1}`,
        diaChi: '',
        vido: 10.762622, // Default HCM
        kinhdo: 106.660172
      }]
    }));
  };

  const handleStopChange = (index, field, value) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const handleRemoveStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const handleSelectStop = (e) => {
    const stopId = parseInt(e.target.value);
    if (!stopId) return;

    const selectedStop = availableStops.find(s => s.diemDungId === stopId);
    if (selectedStop) {
      // Check if already added
      if (formData.stops.some(s => s.diemDungId === stopId)) {
        toast.warning("This stop is already in the route");
        e.target.value = "";
        return;
      }

      setFormData(prev => ({
        ...prev,
        stops: [...prev.stops, {
          ...selectedStop,
          tempId: Date.now()
        }]
      }));
      toast.success(`Added stop: ${selectedStop.tenDiemDung}`);
    }
    e.target.value = "";
  };

  const handleMapClick = (latlng) => {
    // If modal is open, add stop at clicked location
    if (isModalOpen) {
      setFormData(prev => ({
        ...prev,
        stops: [...prev.stops, {
          tempId: Date.now(),
          tenDiemDung: `New Stop`,
          diaChi: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
          vido: latlng.lat,
          kinhdo: latlng.lng
        }]
      }));
      toast.info("Added stop at clicked location");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        // Update logic (might need backend update to support full update)
        // For now, let's assume updateRoute handles basic info, 
        // and we might need separate calls for stops if backend doesn't support full update yet.
        // But user asked for "create", so let's focus on create working perfectly first.
        await schoolService.updateRoute(editingRoute.tuyenDuongId, formData);
        toast.success("Route updated");
      } else {
        await schoolService.createRoute(formData);
        toast.success("Route created successfully");
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const filteredRoutes = routes.filter(r =>
    (r.tenTuyen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.maTuyen || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="school-routes-container">
      <div className="routes-header">
        <div>
          <h1 className="text-2xl font-bold">Route Management</h1>
          <p className="text-sm mt-1 opacity-80">Define routes and stops</p>
        </div>
        <div className="flex gap-3">
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('list')}
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List size={18} /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            >
              <MapIcon size={18} /> Map
            </button>
          </div>
          <button className="btn-primary" onClick={handleCreateClick}>
            <Plus size={18} /> Create Route
          </button>
        </div>
      </div>

      <div className="routes-content">
        {viewMode === 'list' ? (
          <div className="routes-list-view">
            <div className="search-bar">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="routes-grid">
              {filteredRoutes.map(route => (
                <div key={route.tuyenDuongId} className="route-card">
                  <div className="route-card-header">
                    <div className="route-icon">
                      <Navigation size={24} color="#2563eb" />
                    </div>
                    <div className="route-info">
                      <h3>{route.tenTuyen}</h3>
                      <span className="route-code">{route.maTuyen}</span>
                    </div>
                    <div className="route-actions">
                      <button onClick={() => handleEditClick(route)} className="action-btn edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(route.tuyenDuongId)} className="action-btn delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="route-stats">
                    <div className="stat">
                      <MapPin size={14} />
                      <span>{route.tuyenduong_diemdung?.length || 0} Stops</span>
                    </div>
                  </div>
                  <div className="route-stops-preview">
                    {route.tuyenduong_diemdung?.slice(0, 3).map((stop, idx) => (
                      <div key={idx} className="stop-dot">
                        <div className="dot"></div>
                        <span className="stop-name">{stop.diemdung?.tenDiemDung}</span>
                      </div>
                    ))}
                    {(route.tuyenduong_diemdung?.length || 0) > 3 && (
                      <div className="more-stops">+{route.tuyenduong_diemdung.length - 3} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="routes-map-view">
            <MapContainer
              center={[10.762622, 106.660172]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {filteredRoutes.map(route => (
                <React.Fragment key={route.tuyenDuongId}>
                  {route.tuyenduong_diemdung?.map(td => (
                    <Marker
                      key={td.diemDungId}
                      position={[td.diemdung.vido || 0, td.diemdung.kinhdo || 0]}
                    >
                      <Popup>
                        <strong>{td.diemdung.tenDiemDung}</strong><br />
                        {route.tenTuyen}
                      </Popup>
                    </Marker>
                  ))}
                  {route.tuyenduong_diemdung?.length > 1 && (
                    <Polyline
                      positions={route.tuyenduong_diemdung.map(td => [td.diemdung.vido || 0, td.diemdung.kinhdo || 0])}
                      color="#2563eb"
                    />
                  )}
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{editingRoute ? 'Edit Route' : 'Create New Route'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="route-form">
              <div className="form-section">
                <h3>General Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Route Code</label>
                    <input
                      type="text"
                      name="maTuyen"
                      value={formData.maTuyen}
                      onChange={handleInputChange}
                      required
                      readOnly={!!editingRoute}
                    />
                  </div>
                  <div className="form-group">
                    <label>Route Name</label>
                    <input
                      type="text"
                      name="tenTuyen"
                      value={formData.tenTuyen}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., District 1 - District 5"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h3>Stops</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                      className="form-select"
                      onChange={handleSelectStop}
                      defaultValue=""
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="" disabled>Select existing stop...</option>
                      {availableStops.map(stop => (
                        <option key={stop.diemDungId} value={stop.diemDungId}>
                          {stop.tenDiemDung}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn-secondary small" onClick={handleAddStop}>
                      <Plus size={14} /> New Custom
                    </button>
                  </div>
                </div>
                <div className="stops-list">
                  {formData.stops.map((stop, index) => (
                    <div key={stop.tempId || stop.diemDungId} className="stop-item">
                      <div className="stop-order">{index + 1}</div>
                      <div className="stop-inputs">
                        <input
                          type="text"
                          placeholder="Stop Name"
                          value={stop.tenDiemDung}
                          onChange={(e) => handleStopChange(index, 'tenDiemDung', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Address"
                          value={stop.diaChi}
                          onChange={(e) => handleStopChange(index, 'diaChi', e.target.value)}
                        />
                        <div className="coords-inputs">
                          <input
                            type="number"
                            placeholder="Lat"
                            value={stop.vido}
                            onChange={(e) => handleStopChange(index, 'vido', e.target.value)}
                            step="any"
                          />
                          <input
                            type="number"
                            placeholder="Lng"
                            value={stop.kinhdo}
                            onChange={(e) => handleStopChange(index, 'kinhdo', e.target.value)}
                            step="any"
                          />
                        </div>
                      </div>
                      <button type="button" className="remove-stop-btn" onClick={() => handleRemoveStop(index)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {formData.stops.length === 0 && (
                    <div className="empty-stops">
                      No stops added. Click "Add Stop" or click on the map (if available).
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Save size={18} /> Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
