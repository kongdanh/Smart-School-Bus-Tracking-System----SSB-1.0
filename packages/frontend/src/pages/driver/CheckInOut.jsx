import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import tripService from "../../services/tripService";
import "../../styles/driver-styles/driver-checkInOut..css"; // Giữ file CSS cũ của bạn
import {
    User, Bus, Clock, MapPin, CheckCircle,
    Fuel, Gauge, Lightbulb, Eye, Sofa, HeartPulse,
    Siren, DoorOpen, Power, LogIn, LogOut
} from "lucide-react";

export default function CheckInOut() {
    // State chứa dữ liệu thật từ API
    const [driver, setDriver] = useState(null);
    const [bus, setBus] = useState(null);
    const [schedules, setSchedules] = useState([]);

    // State quản lý trạng thái UI
    const [loading, setLoading] = useState(true);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    // Quản lý ID để gọi API
    const [currentTripId, setCurrentTripId] = useState(null); // ID Lịch trình đang chạy
    const [tripRecordId, setTripRecordId] = useState(null);   // ID Record chuyến đi (để End Trip)
    const [checkInTime, setCheckInTime] = useState(null);

    // State cho Form
    const [notes, setNotes] = useState("");
    const [preCheckList, setPreCheckList] = useState({
        fuelLevel: false, tiresCondition: false, lightsWorking: false,
        mirrorsAdjusted: false, cleanInterior: false, firstAidKit: false,
        fireExtinguisher: false, emergencyExit: false
    });

    // 1. Fetch Data ngay khi component được load
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await tripService.getDriverDashboard();

            if (res.success) {
                const { driver, bus, schedules, currentTrip, tripRecordId } = res.data;

                setDriver(driver);
                setBus(bus);
                setSchedules(schedules || []);

                // Nếu Backend trả về đang có chuyến 'in_progress' -> Tự động chuyển UI sang trạng thái Đã Check In
                if (currentTrip) {
                    setIsCheckedIn(true);
                    setCurrentTripId(currentTrip.lichTrinhId);
                    setTripRecordId(tripRecordId);
                    // Lấy giờ khởi hành làm giờ check-in (hoặc giờ hiện tại nếu null)
                    setCheckInTime(currentTrip.tripRecords[0]?.thoiGianKD || new Date());
                } else {
                    setIsCheckedIn(false);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải thông tin tài xế! Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckListChange = (key) => {
        setPreCheckList(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const allChecksCompleted = () => Object.values(preCheckList).every(v => v);

    // 2. Xử lý logic VÀO CA (Start Trip)
    const handleCheckIn = async () => {
        if (!allChecksCompleted()) {
            return toast.warning("Vui lòng hoàn thành tất cả mục kiểm tra an toàn trước!");
        }

        // Tìm chuyến xe tiếp theo (trạng thái 'scheduled') để bắt đầu
        // MVP: Tạm thời lấy chuyến scheduled đầu tiên trong danh sách
        const nextTrip = schedules.find(s => s.trangThai === 'scheduled');

        if (!nextTrip) {
            return toast.error("Hôm nay bạn không còn lịch trình nào cần chạy!");
        }

        try {
            setLoading(true);
            // Gọi API Start Trip
            const res = await tripService.startTrip(nextTrip.lichTrinhId);

            if (res.success) {
                toast.success("Đã vào ca & Bắt đầu chuyến xe thành công!");
                setIsCheckedIn(true);
                setCheckInTime(new Date());
                setTripRecordId(res.data.tripRecordId);
                setCurrentTripId(nextTrip.lichTrinhId);

                // Refresh lại data để cập nhật trạng thái UI chính xác
                fetchDashboardData();
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi vào ca");
        } finally {
            setLoading(false);
        }
    };

    // 3. Xử lý logic RA CA (End Trip)
    const handleCheckOut = async () => {
        if (!notes.trim()) {
            return toast.warning("Vui lòng nhập ghi chú hoặc số KM xe trước khi ra ca!");
        }

        if (!tripRecordId) {
            return toast.error("Không tìm thấy thông tin chuyến đi để kết thúc!");
        }

        try {
            setLoading(true);
            // Gọi API End Trip
            // Lưu ý: MVP này đang dùng field 'notes' làm nơi nhập liệu check-out chung
            // Bạn có thể parse số km từ notes hoặc thêm input riêng nếu muốn
            const kmExample = 0; // Tạm để 0 hoặc lấy từ input người dùng

            const res = await tripService.endTrip(tripRecordId, kmExample);

            if (res.success) {
                toast.success("Đã kết thúc chuyến xe & Ra ca thành công!");
                setIsCheckedIn(false);
                setNotes("");
                setPreCheckList({
                    fuelLevel: false, tiresCondition: false, lightsWorking: false,
                    mirrorsAdjusted: false, cleanInterior: false, firstAidKit: false,
                    fireExtinguisher: false, emergencyExit: false
                });

                // Refresh data
                fetchDashboardData();
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi ra ca");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "--:--";
        return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading && !driver) return <div className="loading-screen">Đang tải dữ liệu...</div>;

    return (
        <div className="checkin-container">
            <div className="checkin-header">
                <div className="header-content">
                    <h1>Điểm Danh & Quản Lý Chuyến</h1>
                    <p>Chào tài xế {driver?.hoTen}, chúc bạn thượng lộ bình an!</p>
                </div>
            </div>

            {/* CARD TRẠNG THÁI */}
            <div className={`status-card ${isCheckedIn ? 'checked-in' : 'checked-out'}`}>
                <div className="status-main">
                    <div className="pulse-circle">
                        {isCheckedIn ? <Clock size={32} /> : <Power size={32} />}
                    </div>
                    <div className="status-main-info">
                        <h3>{isCheckedIn ? 'Đang thực hiện lộ trình' : 'Xe đang nghỉ'}</h3>
                        {isCheckedIn ? (
                            <div className="working-info">
                                <p>Bắt đầu lúc: <strong>{formatTime(checkInTime)}</strong></p>
                                <p className="working-hours">
                                    Tuyến: {schedules.find(s => s.lichTrinhId === currentTripId)?.tuyenduong?.tenTuyen || "Không xác định"}
                                </p>
                            </div>
                        ) : (
                            <p className="ready-text">Vui lòng kiểm tra xe trước khi khởi hành</p>
                        )}
                    </div>
                </div>
                {isCheckedIn && (
                    <div className="location-badge">
                        <MapPin size={18} /><span>GPS Đang Bật</span>
                    </div>
                )}
            </div>

            <div className="checkin-content">
                <div className="info-section">
                    {/* THÔNG TIN TÀI XẾ */}
                    <div className="driver-card">
                        <div className="card-header"><User size={24} /><h3>Tài xế</h3></div>
                        <div className="info-grid">
                            <div className="info-item"><span className="label">Họ tên:</span><span className="value">{driver?.hoTen || "N/A"}</span></div>
                            <div className="info-item"><span className="label">Bằng lái:</span><span className="value">{driver?.bienSoCapphep || "N/A"}</span></div>
                            <div className="info-item"><span className="label">Đánh giá:</span><span className="value">⭐ {driver?.gioHeBay || 5.0}/5.0</span></div>
                        </div>
                    </div>

                    {/* THÔNG TIN XE BUÝT */}
                    <div className="bus-card">
                        <div className="card-header"><Bus size={24} /><h3>Xe Buýt</h3></div>
                        <div className="info-grid">
                            <div className="info-item"><span className="label">Mã xe:</span><span className="value">{bus?.maXe || "Chưa gán"}</span></div>
                            <div className="info-item"><span className="label">Biển số:</span><span className="value">{bus?.bienSo || "N/A"}</span></div>
                            <div className="info-item"><span className="label">Sức chứa:</span><span className="value">{bus?.sucChua || 0} chỗ</span></div>
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH LỊCH TRÌNH */}
                <div className="schedule-preview">
                    <h3>Lịch trình hôm nay ({new Date().toLocaleDateString('vi-VN')})</h3>
                    <div className="schedule-list">
                        {schedules.filter(s => s.trangThai !== 'completed').length === 0 ?
                            <p className="no-data">Không có lịch trình nào cần chạy.</p> :
                            schedules.filter(s => s.trangThai !== 'completed').map((sch) => (
                                <div key={sch.lichTrinhId} className={`schedule-item ${sch.trangThai}`}>
                                    <div className="time-badge">{formatTime(sch.gioKhoiHanh)}</div>
                                    <div className="schedule-info">
                                        <h4>{sch.tuyenduong?.tenTuyen}</h4>
                                        <p>
                                            Trạng thái:
                                            <span className={`status-label ${sch.trangThai}`}>
                                                {sch.trangThai === 'in_progress' ? ' Đang chạy' : ' Chưa chạy'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* FORM CHECK IN / OUT */}
                {!isCheckedIn ? (
                    <div className="checklist-section">
                        <h3>Kiểm tra an toàn trước khi chạy</h3>
                        <div className="checklist">
                            {[
                                { key: 'fuelLevel', icon: Fuel, label: 'Nhiên liệu đủ (>1/4 bình)' },
                                { key: 'tiresCondition', icon: Gauge, label: 'Áp suất lốp ổn định' },
                                { key: 'lightsWorking', icon: Lightbulb, label: 'Đèn tín hiệu hoạt động' },
                                { key: 'mirrorsAdjusted', icon: Eye, label: 'Gương chiếu hậu chuẩn' },
                                { key: 'cleanInterior', icon: Sofa, label: 'Nội thất sạch sẽ' },
                                { key: 'firstAidKit', icon: HeartPulse, label: 'Có hộp sơ cứu' },
                                { key: 'fireExtinguisher', icon: Siren, label: 'Có bình chữa cháy' },
                                { key: 'emergencyExit', icon: DoorOpen, label: 'Lối thoát hiểm thoáng' }
                            ].map(item => (
                                <label key={item.key} className="checkbox-item">
                                    <input type="checkbox" checked={preCheckList[item.key]} onChange={() => handleCheckListChange(item.key)} />
                                    <span className="checkmark">{preCheckList[item.key] && <CheckCircle size={16} />}</span>
                                    <item.icon size={20} className="check-icon" />
                                    <span className="label-text">{item.label}</span>
                                </label>
                            ))}
                        </div>
                        <button className="btn-checkin" onClick={handleCheckIn} disabled={loading}>
                            {loading ? "Đang xử lý..." : <><LogIn size={20} /> VÀO CA & BẮT ĐẦU</>}
                        </button>
                    </div>
                ) : (
                    <div className="notes-section">
                        <h3>Kết thúc chuyến xe & Ra ca</h3>
                        <div className="form-group">
                            <label>Ghi chú chuyến đi / Sự cố (nếu có)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Nhập ghi chú hoặc số km xe..."
                                rows="4"
                            ></textarea>
                        </div>
                        <button className="btn-checkout" onClick={handleCheckOut} disabled={loading}>
                            {loading ? "Đang xử lý..." : <><LogOut size={20} /> KẾT THÚC & RA CA</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}