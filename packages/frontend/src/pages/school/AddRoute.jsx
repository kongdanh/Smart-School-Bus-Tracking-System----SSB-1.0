import React, { useState, useEffect } from 'react';
import schoolService from '../../services/schoolService';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-add-route.css';

// Danh sách phường/xã TP.HCM
const DISTRICTS_HCM = [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7',
    'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12',
    'Quận Bình Tân', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận',
    'Quận Tân Bình', 'Quận Tân Phú', 'Quận Thủ Đức',
    'Huyện Bình Chánh', 'Huyện Cần Giuộc', 'Huyện Cần Giờ', 'Huyện Châu Thành',
    'Huyện Hóc Môn', 'Huyện Nhà Bè', 'Huyện Củ Chi'
];

// Hàm geocode địa chỉ (sử dụng OpenStreetMap Nominatim)
const geocodeAddress = async (address, district) => {
    try {
        const fullAddress = `${address}, ${district}, TP. Hồ Chí Minh, Việt Nam`;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`
        );
        const data = await response.json();
        if (data.length > 0) {
            return {
                vido: parseFloat(data[0].lat),
                kinhdo: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

const AddRoute = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        maTuyen: '',
        tenTuyen: '',
        stops: [],
        selectedBusId: '',
        selectedDriverId: '',
        startTime: '',
        selectedStudents: []
    });

    const [stops, setStops] = useState([]);
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newStop, setNewStop] = useState({
        tenDiemDung: '',
        diaChi: '',
        selectedStudentId: '',
        phuongXa: ''
    });

    useEffect(() => {
        fetchBusesDriversStudents();
    }, []);

    const fetchBusesDriversStudents = async () => {
        try {
            setLoading(true);
            const [busRes, driverRes, studentRes] = await Promise.all([
                schoolService.getAllBuses(),
                schoolService.getAllDrivers(),
                schoolService.getAllStudents()
            ]);

            if (busRes.success) setBuses(busRes.data || []);
            if (driverRes.success) setDrivers(driverRes.data || []);
            if (studentRes.success) setStudents(studentRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStop = async () => {
        if (!newStop.tenDiemDung || !newStop.diaChi || !newStop.phuongXa) {
            toast.warning('Vui lòng nhập tên, địa chỉ và chọn phường/xã');
            return;
        }

        // Check for duplicate addresses
        const isDuplicate = formData.stops.some(s => s.diaChi.toLowerCase() === newStop.diaChi.toLowerCase());
        if (isDuplicate) {
            toast.warning('Địa chỉ này đã tồn tại trong danh sách điểm dừng');
            return;
        }

        // Geocode the address
        toast.loading('Đang xử lý toạ độ...');
        const coords = await geocodeAddress(newStop.diaChi, newStop.phuongXa);

        if (!coords) {
            toast.error('Không thể xác định toạ độ. Vui lòng kiểm tra địa chỉ');
            return;
        }

        const stop = {
            tenDiemDung: newStop.tenDiemDung,
            diaChi: newStop.diaChi,
            vido: coords.vido,
            kinhdo: coords.kinhdo,
            id: Date.now(),
            thuTu: formData.stops.length + 1
        };

        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, stop]
        }));

        setNewStop({
            tenDiemDung: '',
            diaChi: '',
            selectedStudentId: '',
            phuongXa: ''
        });

        toast.success('Đã thêm điểm dừng');
    };

    // Handle student selection for auto-filling stop address
    const handleStudentSelect = (studentId) => {
        if (!studentId) {
            setNewStop(prev => ({
                ...prev,
                selectedStudentId: '',
                tenDiemDung: '',
                diaChi: '',
                phuongXa: ''
            }));
            return;
        }

        const student = students.find(s => s.id === parseInt(studentId) || s.maHS === studentId);
        if (student) {
            setNewStop(prev => ({
                ...prev,
                selectedStudentId: studentId,
                tenDiemDung: student.hoTen || '',
                diaChi: student.diemDon || student.diaChiHienTai || '',
                phuongXa: student.phuongXa || student.quan || ''
            }));
        }
    };

    const handleRemoveStop = (id) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.filter(s => s.id !== id)
        }));
    };

    const handleStudentToggle = (studentId) => {
        setFormData(prev => ({
            ...prev,
            selectedStudents: prev.selectedStudents.includes(studentId)
                ? prev.selectedStudents.filter(id => id !== studentId)
                : [...prev.selectedStudents, studentId]
        }));
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.maTuyen || !formData.tenTuyen || formData.stops.length === 0) {
                toast.warning('Vui lòng nhập mã tuyến, tên tuyến và ít nhất 1 điểm dừng');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.selectedBusId || !formData.selectedDriverId) {
                toast.warning('Vui lòng chọn xe buýt và tài xế');
                return;
            }
            setStep(3);
        } else if (step === 3) {
            if (!formData.startTime) {
                toast.warning('Vui lòng nhập giờ bắt đầu');
                return;
            }
            setStep(4);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (formData.selectedStudents.length === 0) {
            toast.warning('Vui lòng chọn ít nhất 1 học sinh');
            return;
        }

        try {
            setLoading(true);

            // Create route
            const routeRes = await schoolService.createRoute({
                maTuyen: formData.maTuyen,
                tenTuyen: formData.tenTuyen
            });

            if (!routeRes.success) {
                toast.error(routeRes.message || 'Lỗi khi tạo tuyến');
                return;
            }

            const routeId = routeRes.data.tuyenDuongId;

            // Add stops to route
            for (const stop of formData.stops) {
                await schoolService.addStopToRoute(routeId, {
                    tenDiemDung: stop.tenDiemDung,
                    diaChi: stop.diaChi,
                    vido: parseFloat(stop.vido) || null,
                    kinhdo: parseFloat(stop.kinhdo) || null,
                    thuTu: stop.thuTu
                });
            }

            // Fix timezone: adjust startTime by adding UTC+7 offset
            const [hours, minutes] = formData.startTime.split(':');
            const adjustedDate = new Date();
            adjustedDate.setHours(parseInt(hours), parseInt(minutes), 0);
            adjustedDate.setHours(adjustedDate.getHours() + 7);
            const adjustedTime = adjustedDate.toTimeString().slice(0, 5);

            // Calculate end time = start time + 2 hours
            const endDate = new Date();
            endDate.setHours(parseInt(hours) + 2, parseInt(minutes), 0);
            endDate.setHours(endDate.getHours() + 7);
            const endTime = endDate.toTimeString().slice(0, 5);

            // Create schedule
            const scheduleRes = await schoolService.createSchedule({
                maLich: `LCH-${formData.maTuyen}-${Date.now()}`,
                ngay: new Date().toISOString().split('T')[0],
                gioKhoiHanh: adjustedTime,
                gioKetThuc: endTime,
                tuyenDuongId: routeId,
                xeBuytId: parseInt(formData.selectedBusId),
                taiXeId: parseInt(formData.selectedDriverId)
            });

            if (!scheduleRes.success) {
                toast.error(scheduleRes.message || 'Lỗi khi tạo lịch trình');
                return;
            }

            // Assign students to schedule
            const scheduleId = scheduleRes.data.lichTrinhId;
            for (const studentId of formData.selectedStudents) {
                await schoolService.assignStudentToSchedule(scheduleId, studentId);
            }

            toast.success('Tạo tuyến đường thành công!');
            // Redirect back and reload
            setTimeout(() => {
                window.history.back();
            }, 500);
        } catch (error) {
            console.error('Error creating route:', error);
            toast.error('Lỗi khi tạo tuyến đường');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-route-container">
            <div className="add-route-header">
                <h1>Tạo Tuyến Đường Mới</h1>
                <p className="step-indicator">Bước {step}/4</p>
            </div>

            <div className="add-route-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Điểm Dừng</div>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Xe & Tài Xế</div>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Lịch Trình</div>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
                    <div className="step-number">4</div>
                    <div className="step-label">Học Sinh</div>
                </div>
            </div>

            <div className="add-route-content">
                {/* Step 1: Route Info & Stops */}
                {step === 1 && (
                    <div className="form-step">
                        <div className="form-section">
                            <h2>Thông Tin Tuyến Đường</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Mã Tuyến *</label>
                                    <input
                                        type="text"
                                        placeholder="VD: R001, R002"
                                        value={formData.maTuyen}
                                        onChange={e => setFormData(prev => ({ ...prev, maTuyen: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tên Tuyến *</label>
                                    <input
                                        type="text"
                                        placeholder="VD: Tuyến Quận 1"
                                        value={formData.tenTuyen}
                                        onChange={e => setFormData(prev => ({ ...prev, tenTuyen: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Thêm Điểm Dừng</h2>
                            <div className="stop-input-group">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Bước 1: Chọn Phường/Xã *</label>
                                        <select
                                            value={newStop.phuongXa}
                                            onChange={e => setNewStop(prev => ({ ...prev, phuongXa: e.target.value }))}
                                            className="student-select"
                                        >
                                            <option value="">-- Chọn Phường/Xã --</option>
                                            {DISTRICTS_HCM.map(district => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Bước 2: Chọn Học Sinh hoặc Nhập Địa Chỉ</label>
                                        <select
                                            value={newStop.selectedStudentId}
                                            onChange={e => handleStudentSelect(e.target.value)}
                                            className="student-select"
                                        >
                                            <option value="">-- Hoặc nhập thủ công --</option>
                                            {students
                                                .filter(s => !newStop.phuongXa || s.phuongXa === newStop.phuongXa || s.quan === newStop.phuongXa)
                                                .map((student, idx) => (
                                                    <option key={`${student.id}-${idx}`} value={student.id}>
                                                        {student.hoTen} ({student.lop}) - {student.diemDon || student.diaChiHienTai || 'N/A'}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Tên Điểm Dừng *</label>
                                        <input
                                            type="text"
                                            placeholder="VD: Siêu thị ABC, Công viên XYZ"
                                            value={newStop.tenDiemDung}
                                            onChange={e => setNewStop(prev => ({ ...prev, tenDiemDung: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Địa Chỉ Chi Tiết * (số nhà, đường phố)</label>
                                        <input
                                            type="text"
                                            placeholder="VD: 123 Lê Lợi"
                                            value={newStop.diaChi}
                                            onChange={e => setNewStop(prev => ({ ...prev, diaChi: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <button className="btn-add-stop" onClick={handleAddStop}>
                                    + Thêm Điểm Dừng
                                </button>
                            </div>

                            {formData.stops.length > 0 && (
                                <div className="stops-list">
                                    <h3>Danh Sách Điểm Dừng ({formData.stops.length})</h3>
                                    <div className="stops-table">
                                        {formData.stops.map((stop, idx) => (
                                            <div key={stop.id} className="stop-item">
                                                <div className="stop-order">{idx + 1}</div>
                                                <div className="stop-info">
                                                    <div className="stop-name">{stop.tenDiemDung}</div>
                                                    <div className="stop-address">{stop.diaChi}</div>
                                                    {stop.vido && stop.kinhdo && (
                                                        <div className="stop-coords">({stop.vido}, {stop.kinhdo})</div>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn-remove-stop"
                                                    onClick={() => handleRemoveStop(stop.id)}
                                                    title="Xóa"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Bus & Driver */}
                {step === 2 && (
                    <div className="form-step">
                        <div className="form-section">
                            <h2>Chọn Xe Buýt</h2>
                            <div className="bus-grid">
                                {buses.map(bus => (
                                    <div
                                        key={bus.xeBuytId || bus.id}
                                        className={`bus-card ${formData.selectedBusId === String(bus.xeBuytId || bus.id) ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, selectedBusId: String(bus.xeBuytId || bus.id) }))}
                                    >
                                        <div className="bus-icon">🚌</div>
                                        <div className="bus-info">
                                            <div className="bus-plate">{bus.bienSoXe || bus.bienSo}</div>
                                            <div className="bus-seats">{bus.soGhe || 45} chỗ ngồi</div>
                                            <div className={`bus-status ${bus.trangThai?.toLowerCase() || 'active'}`}>
                                                {bus.trangThai || 'Đang hoạt động'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Chọn Tài Xế</h2>
                            <div className="driver-grid">
                                {drivers.map(driver => (
                                    <div
                                        key={driver.taiXeId || driver.id}
                                        className={`driver-card ${formData.selectedDriverId === String(driver.taiXeId || driver.id) ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, selectedDriverId: String(driver.taiXeId || driver.id) }))}
                                    >
                                        <div className="driver-icon">👨‍🚗</div>
                                        <div className="driver-info">
                                            <div className="driver-name">{driver.hoTen || driver.hoTenTx}</div>
                                            <div className="driver-phone">{driver.soDienThoai || driver.dienThoai}</div>
                                            <div className={`driver-status ${driver.trangThai?.toLowerCase() || 'active'}`}>
                                                {driver.trangThai || 'Sẵn sàng'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                    <div className="form-step">
                        <div className="form-section">
                            <h2>Cấu Hình Lịch Trình</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Giờ Bắt Đầu *</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tuyến</label>
                                    <input type="text" value={formData.tenTuyen} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Xe Buýt</label>
                                    <input
                                        type="text"
                                        value={buses.find(b => String(b.xeBuytId || b.id) === formData.selectedBusId)?.bienSoXe || buses.find(b => String(b.xeBuytId || b.id) === formData.selectedBusId)?.bienSo || ''}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tài Xế</label>
                                    <input
                                        type="text"
                                        value={drivers.find(d => String(d.taiXeId || d.id) === formData.selectedDriverId)?.hoTen || drivers.find(d => String(d.taiXeId || d.id) === formData.selectedDriverId)?.hoTenTx || ''}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="schedule-summary">
                                <h3>Tóm Tắt Lịch Trình</h3>
                                <div className="summary-items">
                                    <div className="summary-item">
                                        <span>Số Điểm Dừng:</span>
                                        <strong>{formData.stops.length}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Số Học Sinh:</span>
                                        <strong>{formData.selectedStudents.length}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Students */}
                {step === 4 && (
                    <div className="form-step">
                        <div className="form-section">
                            <h2>Chọn Học Sinh cho Tuyến</h2>
                            <div className="students-selection">
                                {students.length > 0 ? (
                                    <div className="students-grid">
                                        {students.map(student => (
                                            <div
                                                key={student.hocSinhId || student.id}
                                                className={`student-checkbox ${formData.selectedStudents.includes(student.hocSinhId || student.id) ? 'checked' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`student-${student.hocSinhId || student.id}`}
                                                    checked={formData.selectedStudents.includes(student.hocSinhId || student.id)}
                                                    onChange={() => handleStudentToggle(student.hocSinhId || student.id)}
                                                />
                                                <label htmlFor={`student-${student.hocSinhId || student.id}`}>
                                                    <div className="student-check-info">
                                                        <div className="student-check-name">{student.hoTen}</div>
                                                        <div className="student-check-class">{student.lop || 'N/A'}</div>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-data">Không có học sinh nào</div>
                                )}
                            </div>

                            <div className="selection-summary">
                                <strong>Đã chọn {formData.selectedStudents.length} học sinh</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="add-route-footer">
                <button
                    className="btn-prev"
                    onClick={handlePrevStep}
                    disabled={step === 1}
                >
                    ← Quay Lại
                </button>

                {step < 4 ? (
                    <button className="btn-next" onClick={handleNextStep} disabled={loading}>
                        Tiếp Theo →
                    </button>
                ) : (
                    <button
                        className="btn-submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Hoàn Thành'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddRoute;
