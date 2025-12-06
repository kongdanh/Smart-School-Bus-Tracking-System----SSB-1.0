import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import schoolService from "../../services/schoolService";
import scheduleService from "../../services/scheduleService";
import driverService from "../../services/driverService";
import busService from "../../services/busService";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../styles/school-styles/school-routes.css";
import CreateScheduleModal from '../../components/school/schedule-modal/CreateScheduleModal';
import {
  Map as MapIcon,
  List,
  Edit2,
  Plus,
  Search,
  Clock,
  User,
  Bus,
  MapPin,
  Trash2
} from "lucide-react";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SchoolRoutes() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  // View State
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data State
  const [schedules, setSchedules] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]); // Route Definitions
  const [students, setStudents] = useState([]);

  // Selection & Edit State
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fit map bounds when route changes
  useEffect(() => {
    if (viewMode === 'map' && selectedRoute && selectedRoute.stops && selectedRoute.stops.length > 0 && mapRef.current) {
      const validStops = selectedRoute.stops.filter(stop =>
        stop.vido && stop.kinhdo &&
        !isNaN(parseFloat(stop.vido)) && !isNaN(parseFloat(stop.kinhdo))
      );

      if (validStops.length > 0) {
        const bounds = L.latLngBounds(
          validStops.map(stop => [parseFloat(stop.vido), parseFloat(stop.kinhdo)])
        );
        setTimeout(() => {
          mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
        }, 100);
      }
    }
  }, [selectedRoute, viewMode]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [schedulesRes, driversRes, busesRes, routesRes, studentsRes] = await Promise.all([
        schoolService.getAllSchedules(),
        driverService.getAllDrivers(),
        busService.getAllBuses(),
        schoolService.getAllRoutes(),
        schoolService.getAllStudents()
      ]);

      if (schedulesRes?.success) {
        const formattedSchedules = processSchedules(schedulesRes.data);
        setSchedules(formattedSchedules);
        if (formattedSchedules.length > 0) {
          setSelectedRoute(formattedSchedules[0]);
        }
      }

      if (driversRes?.success) setDrivers(driversRes.data);
      if (busesRes?.success) {
        // Handle both array and paginated response format
        setBuses(Array.isArray(busesRes.data) ? busesRes.data : (busesRes.data?.buses || []));
      }
      if (routesRes?.success) setRoutes(routesRes.data);
      if (studentsRes?.success) setStudents(studentsRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const extractTimeFromISO = (isoString) => {
    if (!isoString) return '--:--';
    if (/^\d{2}:\d{2}$/.test(isoString)) return isoString;
    if (/^\d{2}:\d{2}:\d{2}$/.test(isoString)) return isoString.substring(0, 5);

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return isoString;
    }
  };

  const calculateETA = (startTime, stopIndex) => {
    if (!startTime) return '--:--';
    try {
      let hours, minutes;
      if (startTime.includes('T')) {
        const date = new Date(startTime);
        hours = date.getHours();
        minutes = date.getMinutes();
      } else {
        const parts = startTime.split(':');
        hours = parseInt(parts[0]);
        minutes = parseInt(parts[1]);
      }

      if (isNaN(hours) || isNaN(minutes)) return '--:--';

      const date = new Date();
      date.setHours(hours, minutes, 0);
      date.setMinutes(date.getMinutes() + (stopIndex * 15));
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return '--:--';
    }
  };

  const processSchedules = (data) => {
    return data.map((schedule, idx) => {
      // Fix stops mapping từ tuyenduong
      const routeStops = schedule.tuyenduong?.tuyenduong_diemdung || schedule.tuyenduong?.diemDung || [];
      const mappedStops = routeStops.map((stopRelation, index) => {
        const stop = stopRelation.diemdung || stopRelation;
        return {
          ...stop,
          tenDiemDung: stop.tenDiemDung || `Điểm dừng ${index + 1}`,
          vido: stop.vido || stop.latitude,
          kinhdo: stop.kinhdo || stop.longitude,
          eta: calculateETA(schedule.gioKhoiHanh, index + 1)
        };
      });

      return {
        id: schedule.lichTrinhId,
        name: schedule.maLich || `Lịch trình ${schedule.lichTrinhId}`,
        status: schedule.trangThai || 'stopped',
        statusText: schedule.trangThai === 'active' ? 'Đang hoạt động' :
          schedule.trangThai === 'completed' ? 'Đã hoàn thành' : 'Chưa bắt đầu',
        stops: mappedStops,
        students: schedule.studentTrips?.map(st => st.hocsinh) || [],
        gioKhoiHanh: extractTimeFromISO(schedule.gioKhoiHanh),
        gioKetThuc: extractTimeFromISO(schedule.gioKetThuc),
        xeBuyt: schedule.xebuyt ? {
          ...schedule.xebuyt,
          bienSoXe: schedule.xebuyt.bienSo,
          xeBuytId: schedule.xebuyt.xeBuytId || schedule.xebuyt.id
        } : null,
        taiXe: schedule.taixe ? {
          ...schedule.taixe,
          taiXeId: schedule.taixe.taiXeId || schedule.taixe.id
        } : null,
        tuyenDuong: schedule.tuyenduong ? {
          ...schedule.tuyenduong,
          tuyenDuongId: schedule.tuyenduong.tuyenDuongId || schedule.tuyenduong.id
        } : null,
        raw: schedule
      };
    });
  };

  const handleEditClick = (route) => {
    setEditingSchedule(route);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleSaveSchedule = async (data, isEdit) => {
    try {
      console.log('=== HandleSaveSchedule Debug ===');
      console.log('Data received:', data);
      console.log('Is Edit:', isEdit);
      console.log('Editing Schedule:', editingSchedule);

      let response;
      if (isEdit && editingSchedule) {
        // Update logic - use correct ID field
        const scheduleId = editingSchedule.lichTrinhId || editingSchedule.id;
        console.log('Updating with ID:', scheduleId);
        response = await scheduleService.updateSchedule(scheduleId, data);
      } else {
        console.log('Creating new schedule with data:', data);
        response = await scheduleService.createSchedule(data);
      }

      console.log('API Response:', response);

      if (response.success) {
        toast.success(isEdit ? "Cập nhật thành công" : "Tạo lịch trình thành công");
        fetchInitialData();
      } else {
        toast.error(response.message || "Thao tác thất bại");
        if (response.errors) {
          response.errors.forEach(err => toast.error(err));
        }
      }
    } catch (error) {
      console.error('=== HandleSaveSchedule Error ===');
      console.error('Error details:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || "Lỗi hệ thống");
    }
  };

  const filteredRoutes = schedules.filter(route =>
    (route.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (route.taiXe?.hoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (route.xeBuyt?.bienSoXe || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status) => {
    const styles = {
      active: "status-badge status-active",
      completed: "status-badge status-completed",
      pending: "status-badge status-pending",
      stopped: "status-badge status-stopped"
    };

    const labels = {
      active: "Đang chạy",
      completed: "Hoàn thành",
      pending: "Chờ chạy",
      stopped: "Đã dừng"
    };

    return (
      <span className={styles[status] || styles.stopped}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="school-routes-container">
      {/* Header */}
      <div className="routes-header">
        <div>
          <h1 className="text-2xl font-bold">Quản Lý Lịch Trình & Tuyến Đường</h1>
          <p className="text-sm mt-1 opacity-80">Theo dõi, phân công và quản lý vận hành</p>
        </div>
        <div className="flex gap-3">
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('list')}
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List size={18} /> Danh Sách
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            >
              <MapIcon size={18} /> Bản Đồ
            </button>
          </div>
          <button
            onClick={handleCreateClick}
            className="btn btn-primary"
          >
            <Plus size={18} /> Tạo Lịch Trình Mới
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="routes-content">
        {viewMode === 'list' ? (
          <div className="routes-list-view">
            {/* Search & Filter Bar */}
            <div className="search-filter-bar">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, tài xế, biển số..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="filter-select">
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang chạy</option>
                <option value="pending">Chờ chạy</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>

            {/* Table */}
            <div className="routes-table-container">
              <table className="routes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tuyến Đường</th>
                    <th>Thời Gian</th>
                    <th>Tài Xế & Xe</th>
                    <th>Trạng Thái</th>
                    <th className="text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => (
                    <tr key={route.id}>
                      <td className="font-medium">#{route.id}</td>
                      <td>
                        <div className="font-medium">{route.tuyenDuong?.tenTuyen || 'Chưa đặt tên'}</div>
                        <div className="text-sm opacity-70 flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {route.stops.length} điểm dừng
                        </div>
                      </td>

                      <td>
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-green-600" /> {route.gioKhoiHanh}
                          </div>
                          <div className="flex items-center gap-2 opacity-70 mt-1">
                            <Clock size={14} className="text-red-400" /> {route.gioKetThuc}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div className="flex items-center gap-2 font-medium">
                            <User size={14} className="text-blue-600" />
                            {route.taiXe?.hoTen || <span className="text-red-500 italic">Chưa có tài xế</span>}
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1 opacity-80">
                            <Bus size={14} className="text-orange-500" />
                            {route.xeBuyt?.bienSoXe || <span className="text-red-400 italic">Chưa có xe</span>}
                          </div>
                        </div>
                      </td>

                      <td>
                        {renderStatusBadge(route.status)}
                      </td>

                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRoute(route);
                              setViewMode('map');
                            }}
                            className="action-btn btn-view-map"
                            title="Xem bản đồ"
                          >
                            <MapIcon size={18} />
                          </button>
                          <button
                            onClick={() => handleEditClick(route)}
                            className="action-btn btn-edit"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRoutes.length === 0 && (
                <div className="p-8 text-center opacity-60">
                  Không tìm thấy lịch trình nào phù hợp.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Map View Mode */
          <div className="routes-map-view">
            {/* Sidebar List for Map */}
            <div className="map-sidebar">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Danh Sách Tuyến</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredRoutes.map(route => (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className={`route-card ${selectedRoute?.id === route.id ? 'active' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">#{route.id}</span>
                      {renderStatusBadge(route.status)}
                    </div>
                    <div className="text-sm opacity-80 mb-1">
                      <span className="font-medium">Tài xế:</span> {route.taiXe?.hoTen || 'N/A'}
                    </div>
                    <div className="text-sm opacity-80">
                      <span className="font-medium">Xe:</span> {route.xeBuyt?.bienSoXe || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Container */}
            <div className="map-wrapper">
              {selectedRoute ? (
                <>
                  <div className="map-overlay-info">
                    <div>
                      <h3 className="font-bold text-lg">
                        {selectedRoute.tuyenDuong?.tenTuyen || `Lịch trình #${selectedRoute.id}`}
                      </h3>
                      <p className="text-sm opacity-80">
                        {selectedRoute.stops.length} điểm dừng • {selectedRoute.gioKhoiHanh} - {selectedRoute.gioKetThuc}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(selectedRoute)}
                        className="btn-primary text-sm"
                      >
                        Chỉnh Sửa
                      </button>
                    </div>
                  </div>

                  <MapContainer
                    ref={mapRef}
                    center={[10.8231, 106.6297]}
                    zoom={13}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />

                    {/* Route Line with Enhanced Styling */}
                    {selectedRoute.stops && selectedRoute.stops.filter(s => s.vido && s.kinhdo).length > 1 && (
                      <Polyline
                        positions={selectedRoute.stops
                          .filter(s => s.vido && s.kinhdo)
                          .map(s => [parseFloat(s.vido), parseFloat(s.kinhdo)])}
                        pathOptions={{ color: '#0066cc', weight: 5, opacity: 0.8, dashArray: '10,10' }}
                      />
                    )}

                    {/* Enhanced Stop Markers */}
                    {selectedRoute.stops?.map((stop, idx) => {
                      if (stop.vido && stop.kinhdo) {
                        const lat = parseFloat(stop.vido);
                        const lng = parseFloat(stop.kinhdo);
                        const isStart = idx === 0;
                        const isEnd = idx === selectedRoute.stops.length - 1;
                        const markerColor = isStart ? '#22c55e' : isEnd ? '#ef4444' : '#3b82f6';

                        return (
                          <Marker
                            key={idx}
                            position={[lat, lng]}
                            icon={L.divIcon({
                              className: 'custom-div-icon',
                              html: `<div style="background: ${markerColor}; 
                                       color: white; width: 30px; height: 30px; border-radius: 50%; 
                                       display: flex; align-items: center; justify-content: center; 
                                       font-weight: bold; font-size: 12px; border: 2px solid white; 
                                       box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${idx + 1}</div>`,
                              iconSize: [30, 30],
                              iconAnchor: [15, 15]
                            })}
                          >
                            <Popup>
                              <div className="p-2 text-gray-800">
                                <strong className="block text-sm mb-1">
                                  {isStart ? '🚌' : isEnd ? '🏁' : '🚏'} #{idx + 1}. {stop.tenDiemDung || `Điểm dừng ${idx + 1}`}
                                </strong>
                                <p className="text-xs text-gray-600 mb-1">{stop.diaChi || 'Chưa có địa chỉ'}</p>
                                <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                                  ETA: {stop.eta}
                                </div>
                                <div className="text-xs mt-1 text-gray-500">
                                  {isStart ? 'Điểm xuất phát' : isEnd ? 'Điểm kết thúc' : `Trạm số ${idx}`}
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      }
                      return null;
                    })}
                  </MapContainer>
                </>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  Chọn một lịch trình để xem bản đồ
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        initialData={editingSchedule}
        routes={routes}
        drivers={drivers}
        buses={buses}
        students={students}
      />
    </div>
  );
}
