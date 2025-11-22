import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/driver-styles/driver-checkInOut..css";
import {
    User, Bus, Clock, MapPin, CheckCircle, XCircle,
    Fuel, Gauge, Lightbulb, Eye, Sofa, HeartPulse,
    Siren, DoorOpen, AlertCircle, LogIn, LogOut,
    Power, PlayCircle  // THÊM 2 CÁI NÀY VÀO
} from "lucide-react";

// Mock data - giữ nguyên 100%
const mockDriver = {
    taiXeId: 1,
    hoTen: "Nguyễn Văn An",
    bienSoCapphep: "B2-12345-VN",
    gioHeBay: 4.8,
    soChuyenHT: 156
};

const mockBus = {
    xeBuytId: 1,
    maXe: "BUS001",
    bienSo: "51A-12345",
    sucChua: 45,
    trangThai: "active",
    namSanXuat: 2020
};

const mockScheduleToday = [
    {
        lichTrinhId: 1,
        maLich: "SCH001",
        gioKhoiHanh: "06:30",
        gioKetThuc: "08:00",
        tuyenDuong: { tenTuyen: "Tuyến 1: Quận 1 - Quận 7" },
        trangThai: "scheduled"
    },
    {
        lichTrinhId: 2,
        maLich: "SCH002",
        gioKhoiHanh: "14:00",
        gioKetThuc: "15:30",
        tuyenDuong: { tenTuyen: "Tuyến 1: Quận 7 - Quận 1" },
        trangThai: "scheduled"
    }
];

export default function CheckInOut() {
    const navigate = useNavigate();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
    const [preCheckList, setPreCheckList] = useState({
        fuelLevel: false,
        tiresCondition: false,
        lightsWorking: false,
        mirrorsAdjusted: false,
        cleanInterior: false,
        firstAidKit: false,
        fireExtinguisher: false,
        emergencyExit: false
    });
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkedIn = localStorage.getItem("driverCheckedIn");
        const checkInData = localStorage.getItem("checkInTime");

        if (checkedIn === "true" && checkInData) {
            setIsCheckedIn(true);
            setCheckInTime(new Date(checkInData));
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error("Lỗi lấy vị trí:", error)
            );
        }
    }, []);

    const handleCheckListChange = (key) => {
        setPreCheckList(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const allChecksCompleted = () => Object.values(preCheckList).every(v => v);

    const handleCheckIn = async () => {
        if (!allChecksCompleted()) {
            toast.warning("Vui lòng hoàn thành tất cả kiểm tra trước khi điểm danh!", {
                position: "bottom-right"
            });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const now = new Date();
            setIsCheckedIn(true);
            setCheckInTime(now);
            localStorage.setItem("driverCheckedIn", "true");
            localStorage.setItem("checkInTime", now.toISOString());

            toast.success("Điểm danh vào ca thành công! Chúc chuyến đi an toàn!", {
                position: "bottom-right",
                autoClose: 3000
            });
            setLoading(false);
        }, 1500);
    };

    const handleCheckOut = async () => {
        if (!notes.trim()) {
            toast.warning("Vui lòng nhập ghi chú cuối ca trước khi điểm danh ra!", {
                position: "bottom-right"
            });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const now = new Date();
            setIsCheckedIn(false);
            setCheckOutTime(now);
            localStorage.removeItem("driverCheckedIn");
            localStorage.removeItem("checkInTime");

            toast.success("Điểm danh ra ca thành công! Cảm ơn bạn đã làm việc hôm nay!", {
                position: "bottom-right",
                autoClose: 3000
            });

            setPreCheckList({
                fuelLevel: false, tiresCondition: false, lightsWorking: false,
                mirrorsAdjusted: false, cleanInterior: false, firstAidKit: false,
                fireExtinguisher: false, emergencyExit: false
            });
            setNotes("");
            setLoading(false);
        }, 1500);
    };

    const formatTime = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const calculateWorkingHours = () => {
        if (!checkInTime) return "0g 0p";
        const diff = new Date() - new Date(checkInTime);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}g ${minutes}p`;
    };

    return (
        <div className="checkin-container">
            {/* ĐÃ XÓA NÚT BACK - CHỈ GIỮ TIÊU ĐỀ */}
            <div className="checkin-header">
                <div className="header-content">
                    <h1>Điểm Danh Vào / Ra Ca</h1>
                    <p>Quản lý chấm công hàng ngày và kiểm tra xe trước khi chạy</p>
                </div>
            </div>

            {/* Trạng thái hiện tại - ĐÃ TỐI ƯU HOÀN CHỈNH */}
            <div className={`status-card ${isCheckedIn ? 'checked-in' : 'checked-out'}`}>
                <div className="status-main">
                    {/* Vòng tròn + icon trạng thái */}
                    <div className="pulse-circle">
                        {isCheckedIn ? (
                            <Clock size={32} strokeWidth={2.5} />
                        ) : (
                            <Power size={32} strokeWidth={2.5} />
                        )}
                    </div>

                    {/* Thông tin trạng thái */}
                    <div className="status-main-info">
                        <h3>{isCheckedIn ? 'Đang trong ca làm việc' : 'Nghỉ ca'}</h3>
                        {isCheckedIn ? (
                            <div className="working-info">
                                <p>Đã vào ca lúc: <strong>{formatTime(checkInTime)}</strong></p>
                                <p className="working-hours">Thời gian làm việc: {calculateWorkingHours()}</p>
                            </div>
                        ) : (
                            <p className="ready-text">Sẵn sàng bắt đầu ca làm việc</p>
                        )}
                    </div>
                </div>

                {/* Nút chọn loại nghỉ ca - CHỈ HIỆN KHI ĐANG TRONG CA */}
                {isCheckedIn && (
                    <div className="break-selector">
                        <select
                            className="break-dropdown"
                            defaultValue=""
                            onChange={(e) => {
                                if (e.target.value) {
                                    toast.info(`Đã chọn: ${e.target.value}`, { autoClose: 2000 });
                                    // Sau này có thể gửi API ghi nhận nghỉ ca
                                }
                            }}
                        >
                            <option value="" disabled>Chọn loại nghỉ ca</option>
                            <option value="Nghỉ trưa">Nghỉ trưa (30-60 phút)</option>
                            <option value="Nghỉ giải lao">Nghỉ giải lao ngắn</option>
                            <option value="Nghỉ giữa ca">Nghỉ giữa ca</option>
                            <option value="Nghỉ kỹ thuật">Nghỉ kỹ thuật / đổ xăng</option>
                            <option value="Nghỉ cá nhân">Nghỉ cá nhân</option>
                        </select>
                    </div>
                )}

                {/* Badge theo dõi vị trí */}
                {isCheckedIn && (
                    <div className="location-badge">
                        <MapPin size={18} />
                        <span>Đang theo dõi vị trí</span>
                    </div>
                )}
            </div>

            <div className="checkin-content">
                {/* Thông tin tài xế & xe */}
                <div className="info-section">
                    <div className="driver-card">
                        <div className="card-header">
                            <User size={24} />
                            <h3>Thông tin tài xế</h3>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Họ tên:</span>
                                <span className="value">{mockDriver.hoTen}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Bằng lái:</span>
                                <span className="value">{mockDriver.bienSoCapphep}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Đánh giá:</span>
                                <span className="value">⭐ {mockDriver.gioHeBay}/5.0</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Chuyến đã hoàn thành:</span>
                                <span className="value">{mockDriver.soChuyenHT}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bus-card">
                        <div className="card-header">
                            <Bus size={24} />
                            <h3>Thông tin xe buýt</h3>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Mã xe:</span>
                                <span className="value">{mockBus.maXe}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Biển số:</span>
                                <span className="value">{mockBus.bienSo}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Sức chứa:</span>
                                <span className="value">{mockBus.sucChua} chỗ ngồi</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Năm sản xuất:</span>
                                <span className="value">{mockBus.namSanXuat}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lịch trình hôm nay */}
                <div className="schedule-preview">
                    <h3>Lịch trình hôm nay</h3>
                    <div className="schedule-list">
                        {mockScheduleToday.map((schedule) => (
                            <div key={schedule.lichTrinhId} className="schedule-item">
                                <div className="time-badge">{schedule.gioKhoiHanh}</div>
                                <div className="schedule-info">
                                    <h4>{schedule.tuyenDuong.tenTuyen}</h4>
                                    <p>{schedule.gioKhoiHanh} - {schedule.gioKetThuc}</p>
                                </div>
                                <span className={`status-badge ${schedule.trangThai}`}>
                                    Đã lên lịch
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Kiểm tra trước ca hoặc ghi chú cuối ca */}
                {!isCheckedIn ? (
                    <div className="checklist-section">
                        <h3>Kiểm tra xe trước khi xuất phát</h3>
                        <p className="section-subtitle">Hoàn thành tất cả mục kiểm tra trước khi bắt đầu ca</p>

                        <div className="checklist">
                            {[
                                { key: 'fuelLevel', icon: Fuel, label: 'Mức nhiên liệu đủ (trên 1/4 bình)' },
                                { key: 'tiresCondition', icon: Gauge, label: 'Lốp xe đủ áp suất và không hư hỏng' },
                                { key: 'lightsWorking', icon: Lightbulb, label: 'Tất cả đèn hoạt động bình thường' },
                                { key: 'mirrorsAdjusted', icon: Eye, label: 'Gương chiếu hậu sạch và điều chỉnh đúng' },
                                { key: 'cleanInterior', icon: Sofa, label: 'Nội thất xe sạch sẽ, gọn gàng' },
                                { key: 'firstAidKit', icon: HeartPulse, label: 'Hộp sơ cứu đầy đủ và còn hạn' },
                                { key: 'fireExtinguisher', icon: Siren, label: 'Bình chữa cháy dễ tiếp cận và còn hạn' },
                                { key: 'emergencyExit', icon: DoorOpen, label: 'Lối thoát hiểm thông thoáng và hoạt động tốt' }
                            ].map(item => (
                                <label key={item.key} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={preCheckList[item.key]}
                                        onChange={() => handleCheckListChange(item.key)}
                                    />
                                    <span className="checkmark">
                                        {preCheckList[item.key] && <CheckCircle size={16} />}
                                    </span>
                                    <item.icon size={20} className="check-icon" />
                                    <span className="label-text">{item.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${(Object.values(preCheckList).filter(v => v).length / 8) * 100}%`
                                }}
                            ></div>
                        </div>
                        <p className="progress-text">
                            {Object.values(preCheckList).filter(v => v).length} / 8 mục đã hoàn thành
                        </p>

                        <button
                            className="btn-checkin"
                            onClick={handleCheckIn}
                            disabled={!allChecksCompleted() || loading}
                        >
                            {loading ? (
                                <>Đang xử lý...</>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Điểm danh vào ca
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="notes-section">
                        <h3>Báo cáo cuối ca</h3>
                        <p className="section-subtitle">Ghi chú về tình hình chuyến đi trước khi ra ca</p>

                        <div className="form-group">
                            <label>Tóm tắt chuyến đi & Ghi chú</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Ví dụ: Tất cả chuyến đi đúng giờ. Không có sự cố. Xe hoạt động tốt. Đã đổ xăng lúc 15h."
                                rows="6"
                                maxLength="500"
                            ></textarea>
                            <span className="char-count">{notes.length} / 500 ký tự</span>
                        </div>

                        <button
                            className="btn-checkout"
                            onClick={handleCheckOut}
                            disabled={!notes.trim() || loading}
                        >
                            {loading ? (
                                <>Đang xử lý...</>
                            ) : (
                                <>
                                    <LogOut size={20} />
                                    Điểm danh ra ca
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}