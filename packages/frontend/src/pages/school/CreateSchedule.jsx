import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import schoolService from '../../services/schoolService';
import '../../styles/school-styles/school-create-schedule.css';

const CreateSchedule = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Route, Step 2: Bus & Driver, Step 3: Students
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [students, setStudents] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [formData, setFormData] = useState({
        maLich: '',
        ngay: new Date().toISOString().split('T')[0],
        gioKhoiHanh: '06:30',
        gioKetThuc: '07:30',
        tuyenDuongId: '',
        xeBuytId: '',
        taiXeId: '',
        selectedStudents: []
    });

    // Load initial data
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [busRes, driverRes, studentRes, routeRes] = await Promise.all([
                schoolService.getAllBuses(),
                schoolService.getAllDrivers(),
                schoolService.getAllStudents(),
                schoolService.getAllRoutes()
            ]);

            if (busRes.success) setBuses(busRes.data || []);
            if (driverRes.success) setDrivers(driverRes.data || []);
            if (studentRes.success) setStudents(studentRes.data || []);
            if (routeRes.success) setRoutes(routeRes.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Filter drivers by availability - only show drivers with no conflicting schedule
    const getAvailableDrivers = () => {
        // In thực tế, backend sẽ kiểm tra xem tài xế có công việc khác vào thời gian này không
        // Với demo, ta hiển thị tất cả
        return drivers.filter(d => d.trangThai === 'active');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

    const validateStep = () => {
        if (step === 1) {
            if (!formData.maLich || !formData.tuyenDuongId) {
                toast.warning('Vui lòng điền đầy đủ thông tin tuyến đường');
                return false;
            }
        } else if (step === 2) {
            if (!formData.xeBuytId || !formData.taiXeId) {
                toast.warning('Vui lòng chọn xe và tài xế');
                return false;
            }
        } else if (step === 3) {
            if (formData.selectedStudents.length === 0) {
                toast.warning('Vui lòng chọn ít nhất một học sinh');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        try {
            setLoading(true);

            // Gửi dữ liệu schedule
            const scheduleRes = await fetch('http://localhost:5000/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    maLich: formData.maLich,
                    ngay: formData.ngay,
                    gioKhoiHanh: formData.gioKhoiHanh,
                    gioKetThuc: formData.gioKetThuc,
                    tuyenDuongId: parseInt(formData.tuyenDuongId),
                    xeBuytId: parseInt(formData.xeBuytId),
                    taiXeId: parseInt(formData.taiXeId)
                })
            });

            const scheduleData = await scheduleRes.json();
            if (!scheduleData.success) {
                throw new Error(scheduleData.message || 'Lỗi tạo lịch trình');
            }

            // Thêm học sinh vào lịch trình
            const lichTrinhId = scheduleData.data.lichTrinhId;
            for (const studentId of formData.selectedStudents) {
                await fetch(`http://localhost:5000/api/schedule/${lichTrinhId}/students`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ hocSinhId: studentId })
                });
            }

            toast.success('Tạo lịch trình thành công!');
            navigate('/school/schedules');
        } catch (error) {
            console.error('Error creating schedule:', error);
            toast.error(error.message || 'Lỗi khi tạo lịch trình');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-schedule-container">
            <div className="schedule-header">
                <h1>Tạo Lịch Trình Mới</h1>
                <p>Tạo lịch trình đưa đón học sinh</p>
            </div>

            {/* Progress Steps */}
            <div className="schedule-steps">
                <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Thông tin tuyến</div>
                </div>
                <div className="step-line" style={{ opacity: step > 1 ? 1 : 0.3 }}></div>
                <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Xe & Tài xế</div>
                </div>
                <div className="step-line" style={{ opacity: step > 2 ? 1 : 0.3 }}></div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Chọn học sinh</div>
                </div>
            </div>

            {/* Step 1: Route Info */}
            {step === 1 && (
                <div className="form-section">
                    <h2>Bước 1: Thông tin lịch trình</h2>

                    <div className="form-group">
                        <label>Mã Lịch Trình *</label>
                        <input
                            type="text"
                            name="maLich"
                            placeholder="VD: LICH20241203001"
                            value={formData.maLich}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Ngày *</label>
                            <input
                                type="date"
                                name="ngay"
                                value={formData.ngay}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Giờ bắt đầu *</label>
                            <input
                                type="time"
                                name="gioKhoiHanh"
                                value={formData.gioKhoiHanh}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Giờ kết thúc *</label>
                            <input
                                type="time"
                                name="gioKetThuc"
                                value={formData.gioKetThuc}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Chọn Tuyến *</label>
                        <select
                            name="tuyenDuongId"
                            value={formData.tuyenDuongId}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Chọn tuyến đường --</option>
                            {routes.map(route => (
                                <option key={route.id} value={route.id}>
                                    {route.tenTuyen || route.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Step 2: Bus & Driver */}
            {step === 2 && (
                <div className="form-section">
                    <h2>Bước 2: Chọn xe và tài xế</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Chọn Xe Buýt *</label>
                            <select
                                name="xeBuytId"
                                value={formData.xeBuytId}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Chọn xe --</option>
                                {buses.map(bus => (
                                    <option key={bus.xeBuytId || bus.id} value={bus.xeBuytId || bus.id}>
                                        {bus.bienSo} (Sức chứa: {bus.sucChua})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Chọn Tài Xế *</label>
                            <select
                                name="taiXeId"
                                value={formData.taiXeId}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Chọn tài xế --</option>
                                {getAvailableDrivers().map(driver => (
                                    <option key={driver.taiXeId || driver.id} value={driver.taiXeId || driver.id}>
                                        {driver.hoTen} ({driver.soDienThoai})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="info-box">
                        <h4>ℹ️ Lưu ý:</h4>
                        <ul>
                            <li>Tài xế phải có trạng thái "Hoạt động"</li>
                            <li>Xe phải có sức chứa đủ cho số học sinh</li>
                            <li>Kiểm tra không có xung đột lịch trình</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Step 3: Select Students */}
            {step === 3 && (
                <div className="form-section">
                    <h2>Bước 3: Chọn học sinh ({formData.selectedStudents.length})</h2>

                    <div className="students-list">
                        {students.map(student => (
                            <div
                                key={student.hocSinhId || student.id}
                                className={`student-item ${formData.selectedStudents.includes(student.hocSinhId || student.id) ? 'selected' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.selectedStudents.includes(student.hocSinhId || student.id)}
                                    onChange={() => handleStudentToggle(student.hocSinhId || student.id)}
                                />
                                <div className="student-info">
                                    <div className="student-name">
                                        {student.hoTen || student.name}
                                        <span className="student-class">{student.lop || student.class}</span>
                                    </div>
                                    <div className="student-detail">
                                        {student.diemDon || student.pickupPoint || 'Điểm đón'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-actions">
                <button
                    onClick={handlePrevious}
                    disabled={step === 1}
                    className="btn-secondary"
                >
                    ← Quay lại
                </button>

                {step < 3 ? (
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="btn-primary"
                    >
                        Tiếp theo →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-success"
                    >
                        {loading ? 'Đang xử lý...' : '✓ Tạo lịch trình'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreateSchedule;
