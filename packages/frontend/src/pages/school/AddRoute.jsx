import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { ArrowLeft, Plus, Trash2, MapPin, Save, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../styles/school-styles/school-add-route.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const AddRoute = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Data State
    const [existingStops, setExistingStops] = useState([]);
    const [filteredStops, setFilteredStops] = useState([]);
    const [stopSearch, setStopSearch] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        maTuyen: '',
        tenTuyen: '',
        stops: [] // Array of { ...stopData, isNew: boolean, tempId: string }
    });

    // New Stop Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStopData, setNewStopData] = useState({
        tenDiemDung: '',
        diaChi: '',
        vido: 10.762622,
        kinhdo: 106.682228
    });

    useEffect(() => {
        fetchStops();
    }, []);

    useEffect(() => {
        if (stopSearch.trim() === '') {
            setFilteredStops(existingStops);
        } else {
            setFilteredStops(existingStops.filter(s =>
                s.tenDiemDung.toLowerCase().includes(stopSearch.toLowerCase()) ||
                (s.diaChi && s.diaChi.toLowerCase().includes(stopSearch.toLowerCase()))
            ));
        }
    }, [stopSearch, existingStops]);

    const fetchStops = async () => {
        try {
            const response = await schoolService.getAllStops();
            if (response.success) {
                setExistingStops(response.data);
                setFilteredStops(response.data);
            }
        } catch (error) {
            console.error("Error fetching stops:", error);
            toast.error("Không thể tải danh sách điểm dừng");
        }
    };

    const handleAddExistingStop = (stop) => {
        // Check if already added
        if (formData.stops.some(s => s.diemDungId === stop.diemDungId)) {
            toast.warning("Điểm dừng này đã được thêm vào tuyến");
            return;
        }

        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, { ...stop, isNew: false }]
        }));
        toast.success(`Đã thêm: ${stop.tenDiemDung}`);
    };

    const handleAddNewStop = () => {
        if (!newStopData.tenDiemDung) {
            toast.error("Vui lòng nhập tên điểm dừng");
            return;
        }

        const tempStop = {
            ...newStopData,
            isNew: true,
            tempId: `new-${Date.now()}`,
            diemDungId: null // Placeholder
        };

        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, tempStop]
        }));

        setIsModalOpen(false);
        setNewStopData({
            tenDiemDung: '',
            diaChi: '',
            vido: 10.762622,
            kinhdo: 106.682228
        });
        toast.success("Đã thêm điểm dừng mới (chưa lưu)");
    };

    const handleRemoveStop = (index) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.filter((_, i) => i !== index)
        }));
    };

    const handleMoveStop = (index, direction) => {
        const newStops = [...formData.stops];
        if (direction === 'up' && index > 0) {
            [newStops[index], newStops[index - 1]] = [newStops[index - 1], newStops[index]];
        } else if (direction === 'down' && index < newStops.length - 1) {
            [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
        }
        setFormData(prev => ({ ...prev, stops: newStops }));
    };

    const handleSubmit = async () => {
        if (!formData.maTuyen || !formData.tenTuyen) {
            toast.error("Vui lòng nhập mã tuyến và tên tuyến");
            return;
        }
        if (formData.stops.length < 2) {
            toast.error("Tuyến đường cần ít nhất 2 điểm dừng");
            return;
        }

        try {
            setLoading(true);

            // 1. Create Route
            const routeRes = await schoolService.createRoute({
                maTuyen: formData.maTuyen,
                tenTuyen: formData.tenTuyen
            });

            if (!routeRes.success) {
                throw new Error(routeRes.message || "Lỗi khi tạo tuyến");
            }

            const routeId = routeRes.data.tuyenDuongId;

            // 2. Add Stops
            for (let i = 0; i < formData.stops.length; i++) {
                const stop = formData.stops[i];
                const payload = {
                    thuTu: i + 1,
                    diemDungId: stop.isNew ? null : stop.diemDungId,
                    // If new, include details
                    tenDiemDung: stop.isNew ? stop.tenDiemDung : undefined,
                    diaChi: stop.isNew ? stop.diaChi : undefined,
                    vido: stop.isNew ? stop.vido : undefined,
                    kinhdo: stop.isNew ? stop.kinhdo : undefined
                };

                await schoolService.addStopToRoute(routeId, payload);
            }

            toast.success("Tạo tuyến đường thành công!");
            navigate('/school/routes');

        } catch (error) {
            console.error("Submit error:", error);
            toast.error(error.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-route-container p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/school/routes')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold">Thêm Tuyến Đường Mới</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Route Info & Selected Stops */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Route Info Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-semibold mb-4">Thông Tin Tuyến</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Tuyến</label>
                                <input
                                    type="text"
                                    value={formData.maTuyen}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maTuyen: e.target.value }))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: R01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Tuyến</label>
                                <input
                                    type="text"
                                    value={formData.tenTuyen}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tenTuyen: e.target.value }))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: Tuyến Quận 1 - Quận 3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Selected Stops List */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Danh Sách Điểm Dừng ({formData.stops.length})</h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                                <Plus size={16} /> Tạo điểm dừng mới
                            </button>
                        </div>

                        {formData.stops.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                Chưa có điểm dừng nào. Hãy chọn từ danh sách bên phải hoặc tạo mới.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {formData.stops.map((stop, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded border group">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{stop.tenDiemDung}</div>
                                            <div className="text-xs text-gray-500">{stop.diaChi}</div>
                                            {stop.isNew && <span className="text-xs text-green-600 font-medium bg-green-50 px-1 rounded">Mới</span>}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleMoveStop(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => handleMoveStop(index, 'down')}
                                                disabled={index === formData.stops.length - 1}
                                                className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => handleRemoveStop(index)}
                                                className="p-1 hover:bg-red-100 text-red-600 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Available Stops */}
                <div className="bg-white p-6 rounded-lg shadow-sm border h-[calc(100vh-100px)] flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Điểm Dừng Có Sẵn</h2>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm điểm dừng..."
                            value={stopSearch}
                            onChange={(e) => setStopSearch(e.target.value)}
                            className="w-full pl-10 p-2 border rounded"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {filteredStops.map(stop => (
                            <div
                                key={stop.diemDungId}
                                className="p-3 border rounded hover:bg-blue-50 cursor-pointer transition-colors"
                                onClick={() => handleAddExistingStop(stop)}
                            >
                                <div className="font-medium text-sm">{stop.tenDiemDung}</div>
                                <div className="text-xs text-gray-500 truncate">{stop.diaChi}</div>
                            </div>
                        ))}
                        {filteredStops.length === 0 && (
                            <div className="text-center text-gray-500 text-sm py-4">
                                Không tìm thấy điểm dừng.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-10">
                <div className="max-w-7xl mx-auto flex justify-end gap-4">
                    <button
                        onClick={() => navigate('/school/routes')}
                        className="px-6 py-2 border rounded hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                        {loading ? 'Đang xử lý...' : <><Save size={18} /> Lưu Tuyến Đường</>}
                    </button>
                </div>
            </div>

            {/* New Stop Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold">Tạo Điểm Dừng Mới</h3>
                            <button onClick={() => setIsModalOpen(false)}><XIcon /></button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên Điểm Dừng</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={newStopData.tenDiemDung}
                                        onChange={e => setNewStopData(prev => ({ ...prev, tenDiemDung: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Địa Chỉ</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={newStopData.diaChi}
                                        onChange={e => setNewStopData(prev => ({ ...prev, diaChi: e.target.value }))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Vĩ độ</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded"
                                            value={newStopData.vido}
                                            onChange={e => setNewStopData(prev => ({ ...prev, vido: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Kinh độ</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded"
                                            value={newStopData.kinhdo}
                                            onChange={e => setNewStopData(prev => ({ ...prev, kinhdo: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 italic">
                                    * Nhấp vào bản đồ để chọn vị trí chính xác
                                </p>
                            </div>
                            <div className="h-64 bg-gray-100 rounded overflow-hidden">
                                <MapContainer center={[10.762622, 106.682228]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[newStopData.vido, newStopData.kinhdo]} />
                                    <MapClickHandler onMapClick={(latlng) => setNewStopData(prev => ({ ...prev, vido: latlng.lat, kinhdo: latlng.lng }))} />
                                </MapContainer>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Hủy</button>
                            <button onClick={handleAddNewStop} className="px-4 py-2 bg-blue-600 text-white rounded">Thêm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default AddRoute;
