import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import attendanceService from "../../services/attendanceService";
import tripService from "../../services/tripService";
import "../../styles/driver-styles/driver-attendance.css";

export default function AttendancePage() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [lastTripId, setLastTripId] = useState(null);  // Track trip ID to avoid reload when trip doesn't change

    // State cho search/filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // State cho Modal ghi chú
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState("");

    // 1. Load dữ liệu khi vào trang và polling mỗi giây để cập nhật attendance realtime
    useEffect(() => {
        fetchTripStatus();  // Initial check-in status

        // Poll mỗi 3 giây để kiểm tra check-in status (check-in/out xảy ra hết giây)
        const tripStatusInterval = setInterval(fetchTripStatus, 3000);

        return () => clearInterval(tripStatusInterval);
    }, []);

    // 2. Khi trip thay đổi, fetch danh sách học sinh (chỉ fetch khi trip ID khác)
    useEffect(() => {
        if (isCheckedIn && currentTrip && currentTrip.lichTrinhId !== lastTripId) {
            fetchStudents();
            setLastTripId(currentTrip.lichTrinhId);
        }
    }, [isCheckedIn, currentTrip?.lichTrinhId]);

    // 3. Khi trip đang active, poll attendance updates mỗi 5 giây (không quá tần suất)
    useEffect(() => {
        if (!isCheckedIn || !currentTrip) return;

        const attendanceInterval = setInterval(fetchStudents, 5000);

        return () => clearInterval(attendanceInterval);
    }, [isCheckedIn, currentTrip?.lichTrinhId]);

    const fetchTripStatus = async () => {
        try {
            // B1: Chỉ kiểm tra check-in status (lightweight)
            const dashboardRes = await tripService.getDriverDashboard();
            const activeTrip = dashboardRes.data.currentTrip;
            const checkedIn = activeTrip && activeTrip.trangThai === 'in_progress';

            setIsCheckedIn(checkedIn);

            if (activeTrip && checkedIn) {
                setCurrentTrip(activeTrip);
            } else {
                setCurrentTrip(null);
                setStudents([]);
                setLastTripId(null);
            }
        } catch (error) {
            console.error('Error checking trip status:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            if (!currentTrip) return;

            setLoading(true);
            // B2: Lấy danh sách học sinh của chuyến này
            const studentRes = await attendanceService.getStudentsBySchedule(currentTrip.lichTrinhId);
            setStudents(studentRes.data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            if (error.response?.status !== 401) {
                // Chỉ show error nếu không phải auth error
            }
        } finally {
            setLoading(false);
        }
    };

    // Thống kê (Tính toán trực tiếp từ state students)
    const stats = {
        total: students.length,
        pickedUp: students.filter(s => s.attendance.loanDon).length,
        droppedOff: students.filter(s => s.attendance.loanTra).length,
        pending: students.filter(s => !s.attendance.loanDon).length,
    };

    // Filter danh sách hiển thị
    const filteredStudents = students.filter(s => {
        const matchSearch = (s.hoTen?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (s.maHS?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        if (filterStatus === "all") return matchSearch;
        if (filterStatus === "picked-up") return matchSearch && s.attendance.loanDon && !s.attendance.loanTra;
        if (filterStatus === "dropped") return matchSearch && s.attendance.loanTra; // Đã trả
        if (filterStatus === "pending") return matchSearch && !s.attendance.loanDon;
        return matchSearch;
    });

    // --- CÁC HÀM XỬ LÝ API ---

    const handleMarkPickup = async (student) => {
        if (!currentTrip) return;

        // Không cho phép hủy đón - chỉ cho phép đón nếu chưa đón
        if (student.attendance.loanDon) {
            return toast.warning("Học sinh đã được đón - không thể hủy. Hãy trả học sinh để hủy.");
        }

        try {
            const res = await attendanceService.markPickup(currentTrip.lichTrinhId, student.hocSinhId);
            toast.success(`Đã đón: ${student.hoTen}`);

            if (res.success) {
                updateStudentState(student.hocSinhId, res.data);
            }
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật");
        }
    };

    const handleMarkDropoff = async (student) => {
        if (!currentTrip) return;
        if (!student.attendance.loanDon) return toast.warning("Phải đón học sinh trước khi trả!");

        try {
            const isCancel = student.attendance.loanTra;
            let res;

            if (isCancel) {
                res = await attendanceService.unmarkDropoff(currentTrip.lichTrinhId, student.hocSinhId);
                toast.info(`Đã hủy trả: ${student.hoTen}`);
            } else {
                res = await attendanceService.markDropoff(currentTrip.lichTrinhId, student.hocSinhId);
                toast.success(`Đã trả: ${student.hoTen}`);
            }

            if (res.success) {
                updateStudentState(student.hocSinhId, res.data);
            }
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật");
        }
    };

    const handleQuickMarkAll = async () => {
        if (!currentTrip) return;
        if (!window.confirm("Xác nhận đón tất cả học sinh chưa đón?")) return;

        try {
            await attendanceService.markAllPickup(currentTrip.lichTrinhId);
            toast.success("Đã điểm danh đón tất cả!");
            fetchStudents(); // Reload lại data cho chắc chắn
        } catch (error) {
            toast.error("Lỗi khi điểm danh nhanh");
        }
    };

    // Hàm helper cập nhật 1 học sinh trong list
    const updateStudentState = (hocSinhId, newAttendanceData) => {
        setStudents(prev => prev.map(s =>
            s.hocSinhId === hocSinhId ? { ...s, attendance: newAttendanceData } : s
        ));
    };

    // --- GHI CHÚ ---
    const openNote = (s) => {
        setSelectedStudent(s);
        setNoteText(s.attendance.ghiChu || "");
        setShowNoteModal(true);
    };

    const saveNote = async () => {
        if (!currentTrip || !selectedStudent) return;
        try {
            const res = await attendanceService.addNote(currentTrip.lichTrinhId, selectedStudent.hocSinhId, noteText);
            if (res.success) {
                updateStudentState(selectedStudent.hocSinhId, res.data);
                toast.success("Đã lưu ghi chú");
                setShowNoteModal(false);
            }
        } catch (error) {
            toast.error("Lỗi lưu ghi chú");
        }
    };

    const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";

    if (loading) return <div className="loading-screen">Đang tải danh sách lớp...</div>;

    // ✅ LOCK UI: Nếu chưa check-in thì hiển thị modal overlay
    if (!isCheckedIn) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 9999
            }}>
                {/* Modal */}
                <div style={{
                    backgroundColor: 'white', padding: '40px', borderRadius: '12px',
                    textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    maxWidth: '400px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                    <h2 style={{ color: '#333', marginBottom: '15px' }}>Trang này chưa khả dụng</h2>
                    <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
                        Bạn cần <strong>Vào ca & Bắt đầu chuyến xe</strong> từ trang <strong>Check-in</strong> trước tiên.
                    </p>
                    <button
                        onClick={() => navigate('/driver/check-in-out')}
                        style={{
                            backgroundColor: '#2563eb', color: 'white', border: 'none',
                            padding: '12px 32px', borderRadius: '6px', cursor: 'pointer',
                            fontSize: '16px', fontWeight: 'bold'
                        }}
                    >
                        📍 Đi tới Check-in
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <div className="loading-screen">Đang tải danh sách lớp...</div>;

    return (
        <div className="attendance-master">
            <div className="page-header-consistent">
                <h1>Điểm Danh Học Sinh</h1>
                <p>Theo dõi việc đón và trả học sinh trên tuyến xe</p>
            </div>

            {/* Thông tin chuyến xe */}
            <div className="trip-header">
                <div className="trip-info">
                    <div className="bus-icon">🚌</div>
                    <div>
                        <strong>{currentTrip.tuyenduong?.tenTuyen}</strong>
                        <div className="time">
                            Khởi hành: {formatTime(currentTrip.gioKhoiHanh)} - {currentTrip.xebuyt?.bienSo}
                        </div>
                    </div>
                </div>
                <button className="quick-mark-btn" onClick={handleQuickMarkAll}>
                    ✓ Đón tất cả
                </button>
            </div>

            {/* Thống kê */}
            <div className="stats-compact">
                <div className="stat"><span className="num total">{stats.total}</span> Tổng</div>
                <div className="stat"><span className="num picked">{stats.pickedUp}</span> Đã đón</div>
                <div className="stat"><span className="num pending">{stats.pending}</span> Chưa đón</div>
                <div className="stat"><span className="num dropped">{stats.droppedOff}</span> Đã trả</div>
            </div>

            {/* Bộ lọc */}
            <div className="controls">
                <div className="search-box">
                    <input type="text" placeholder="🔍 Tìm tên hoặc mã HS..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="filter-tabs">
                    <button className={filterStatus === "all" ? "active" : ""} onClick={() => setFilterStatus("all")}>Tất cả</button>
                    <button className={filterStatus === "picked-up" ? "active" : ""} onClick={() => setFilterStatus("picked-up")}>Trên xe</button>
                    <button className={filterStatus === "pending" ? "active" : ""} onClick={() => setFilterStatus("pending")}>Chưa đón</button>
                </div>
            </div>

            {/* Danh sách học sinh */}
            <div className="student-list">
                {filteredStudents.length === 0 ? <p className="no-data">Không tìm thấy học sinh nào.</p> :
                    filteredStudents.map(s => (
                        <div key={s.hocSinhId} className={`student-row ${s.attendance.loanDon ? "picked" : ""} ${s.attendance.loanTra ? "dropped" : ""}`}>
                            <div className="student-main">
                                <div className="avatar">{s.hoTen ? s.hoTen[0] : "?"}</div>
                                <div className="info">
                                    <div className="name">{s.hoTen} <span className="code">{s.maHS}</span></div>
                                    <div className="details">{s.lop} • {s.diemDon}</div>
                                    {s.attendance.ghiChu && <div className="note-tag">📝 {s.attendance.ghiChu}</div>}
                                </div>
                            </div>

                            <div className="student-actions">
                                <button
                                    className={`act pickup ${s.attendance.loanDon ? "done" : ""}`}
                                    onClick={() => handleMarkPickup(s)}
                                    disabled={s.attendance.loanDon}
                                    title={s.attendance.loanDon ? "Đã đón - không thể hủy" : "Nhấn để đón"}
                                >
                                    {s.attendance.loanDon ? `✓ ${formatTime(s.attendance.thoiGianDon)}` : "Đón"}
                                </button>

                                <button
                                    className={`act dropoff ${s.attendance.loanTra ? "done" : ""}`}
                                    onClick={() => handleMarkDropoff(s)}
                                    disabled={!s.attendance.loanDon}
                                    title={!s.attendance.loanDon ? "Phải đón trước khi trả" : "Nhấn để trả"}
                                >
                                    {s.attendance.loanTra ? `✓ ${formatTime(s.attendance.thoiGianTra)}` : "Trả"}
                                </button>

                                <button className="act note" onClick={() => openNote(s)}>📝</button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Modal ghi chú */}
            {showNoteModal && (
                <div className="modal-backdrop" onClick={() => setShowNoteModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Ghi chú: {selectedStudent?.hoTen}</h3>
                        <textarea
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            placeholder="Ví dụ: Nghỉ ốm, người nhà đón thay..."
                            rows="4"
                        />
                        <div className="modal-btns">
                            <button onClick={() => setShowNoteModal(false)}>Hủy</button>
                            <button className="save" onClick={saveNote}>Lưu lại</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}