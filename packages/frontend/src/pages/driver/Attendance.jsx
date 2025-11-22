import React, { useState } from "react";
import { toast } from "react-toastify";
import "../../styles/driver-styles/driver-attendance.css";

// Mock data giữ nguyên 100%
const mockCurrentTrip = {
    tuyenDuong: { tenTuyen: "Tuyến 1: Quận 1 - Quận 7" },
    gioKhoiHanh: "06:30",
    gioKetThuc: "08:00"
};

const mockStudents = [
    // ... giữ nguyên toàn bộ 5 học sinh bạn đã có (mình chèn đủ ở dưới)
    { hocSinhId: 1, maHS: "HS001", hoTen: "Nguyễn Văn A", lop: "10A1", diemDon: "123 Đường ABC, Q.1", soDienThoaiPH: "0901234567", attendance: { loanDon: false, loanTra: false, thoiGianDon: null, thoiGianTra: null, ghiChu: "" } },
    { hocSinhId: 2, maHS: "HS002", hoTen: "Trần Thị B", lop: "10A2", diemDon: "456 Đường DEF, Q.1", soDienThoaiPH: "0907654321", attendance: { loanDon: false, loanTra: false, thoiGianDon: null, thoiGianTra: null, ghiChu: "" } },
    { hocSinhId: 3, maHS: "HS003", hoTen: "Lê Văn C", lop: "10B1", diemDon: "789 Đường GHI, Q.3", soDienThoaiPH: "0912345678", attendance: { loanDon: false, loanTra: false, thoiGianDon: null, thoiGianTra: null, ghiChu: "" } },
    { hocSinhId: 4, maHS: "HS004", hoTen: "Phạm Thị D", lop: "10B2", diemDon: "321 Đường JKL, Q.5", soDienThoaiPH: "0987654321", attendance: { loanDon: false, loanTra: false, thoiGianDon: null, thoiGianTra: null, ghiChu: "" } },
    { hocSinhId: 5, maHS: "HS005", hoTen: "Hoàng Văn E", lop: "11A1", diemDon: "654 Đường MNO, Q.7", soDienThoaiPH: "0923456789", attendance: { loanDon: false, loanTra: false, thoiGianDon: null, thoiGianTra: null, ghiChu: "" } },
];

export default function AttendancePage() {
    const [students, setStudents] = useState(mockStudents);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState("");

    // Thống kê
    const stats = {
        total: students.length,
        pickedUp: students.filter(s => s.attendance.loanDon).length,
        pending: students.filter(s => !s.attendance.loanDon).length,
        droppedOff: students.filter(s => s.attendance.loanTra).length,
    };

    const filteredStudents = students.filter(s => {
        const matchSearch = s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || s.maHS.toLowerCase().includes(searchTerm.toLowerCase());
        if (filterStatus === "all") return matchSearch;
        if (filterStatus === "picked-up") return matchSearch && s.attendance.loanDon;
        if (filterStatus === "pending") return matchSearch && !s.attendance.loanDon;
        return matchSearch;
    });

    const handleMarkPickup = (id) => {
        setStudents(prev => prev.map(s => {
            if (s.hocSinhId === id) {
                const newVal = !s.attendance.loanDon;
                toast[newVal ? "success" : "info"](newVal ? `${s.hoTen} – Đã đón ✓` : `${s.hoTen} – Bỏ đón`);
                return { ...s, attendance: { ...s.attendance, loanDon: newVal, thoiGianDon: newVal ? new Date().toISOString() : null } };
            }
            return s;
        }));
    };

    const handleMarkDropoff = (id) => {
        const student = students.find(s => s.hocSinhId === id);
        if (!student.attendance.loanDon) return toast.warning("Phải đón trước khi trả!");
        setStudents(prev => prev.map(s => {
            if (s.hocSinhId === id) {
                const newVal = !s.attendance.loanTra;
                toast[newVal ? "success" : "info"](newVal ? `${s.hoTen} – Đã trả ✓` : `${s.hoTen} – Bỏ trả`);
                return { ...s, attendance: { ...s.attendance, loanTra: newVal, thoiGianTra: newVal ? new Date().toISOString() : null } };
            }
            return s;
        }));
    };

    const handleQuickMarkAll = () => {
        setStudents(prev => prev.map(s => ({
            ...s, attendance: { ...s.attendance, loanDon: true, thoiGianDon: new Date().toISOString() }
        })));
        toast.success("Đã đánh dấu ĐÓN TẤT CẢ học sinh!");
    };

    const openNote = (s) => {
        setSelectedStudent(s);
        setNoteText(s.attendance.ghiChu || "");
        setShowNoteModal(true);
    };

    const saveNote = () => {
        setStudents(prev => prev.map(s => s.hocSinhId === selectedStudent.hocSinhId ? { ...s, attendance: { ...s.attendance, ghiChu: noteText } } : s));
        toast.success("Đã lưu ghi chú");
        setShowNoteModal(false);
    };

    const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--";

    return (
        <div className="attendance-master">
            <h1 className="page-title">Điểm Danh Học Sinh</h1>
            <p className="page-subtitle">Theo dõi việc đón và trả trên tuyến xe</p>

            {/* Tuyến + Quick button */}
            <div className="trip-header">
                <div className="trip-info">
                    <div className="bus-icon">Bus</div>
                    <div>
                        <strong>{mockCurrentTrip.tuyenDuong.tenTuyen}</strong>
                        <div className="time">{mockCurrentTrip.gioKhoiHanh} – {mockCurrentTrip.gioKetThuc}</div>
                    </div>
                </div>
                <button className="quick-mark-btn" onClick={handleQuickMarkAll}>
                    Check All Đón tất cả
                </button>
            </div>

            {/* Stats 4 ô nhỏ gọn */}
            <div className="stats-compact">
                <div className="stat"><span className="num total">{stats.total}</span> Tổng</div>
                <div className="stat"><span className="num picked">{stats.pickedUp}</span> Đã đón</div>
                <div className="stat"><span className="num pending">{stats.pending}</span> Chưa đón</div>
                <div className="stat"><span className="num dropped">{stats.droppedOff}</span> Đã trả</div>
            </div>

            {/* Search + Filter */}
            <div className="controls">
                <div className="search-box">
                    <input type="text" placeholder="Tìm học sinh..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="filter-tabs">
                    <button className={filterStatus === "all" ? "active" : ""} onClick={() => setFilterStatus("all")}>Tất cả</button>
                    <button className={filterStatus === "picked-up" ? "active" : ""} onClick={() => setFilterStatus("picked-up")}>Đã đón</button>
                    <button className={filterStatus === "pending" ? "active" : ""} onClick={() => setFilterStatus("pending")}>Chưa đón</button>
                </div>
            </div>

            {/* DANH SÁCH HỌC SINH – HIỂN THỊ NGAY, KHÔNG CẦN SCROLL */}
            <div className="student-list">
                {filteredStudents.map(s => (
                    <div key={s.hocSinhId} className={`student-row ${s.attendance.loanDon ? "picked" : ""} ${s.attendance.loanTra ? "dropped" : ""}`}>
                        <div className="student-main">
                            <div className="avatar">{s.hoTen[0]}</div>
                            <div className="info">
                                <div className="name">{s.hoTen} <span className="code">{s.maHS}</span></div>
                                <div className="details">{s.lop} • {s.diemDon}</div>
                                {s.attendance.ghiChu && <div className="note-tag">Note: {s.attendance.ghiChu}</div>}
                            </div>
                        </div>

                        <div className="student-actions">
                            <button className={`act pickup ${s.attendance.loanDon ? "done" : ""}`} onClick={() => handleMarkPickup(s.hocSinhId)}>
                                {s.attendance.loanDon ? `Check ${formatTime(s.attendance.thoiGianDon)}` : "Pickup"}
                            </button>
                            <button className={`act dropoff ${s.attendance.loanTra ? "done" : ""}`} onClick={() => handleMarkDropoff(s.hocSinhId)} disabled={!s.attendance.loanDon}>
                                {s.attendance.loanTra ? `Check ${formatTime(s.attendance.thoiGianTra)}` : "Drop"}
                            </button>
                            <button className="act note" onClick={() => openNote(s)}>Note</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal ghi chú */}
            {showNoteModal && (
                <div className="modal-backdrop" onClick={() => setShowNoteModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Ghi chú - {selectedStudent?.hoTen}</h3>
                        <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="VD: Đi muộn, có phụ huynh đón..." rows="4" />
                        <div className="modal-btns">
                            <button onClick={() => setShowNoteModal(false)}>Hủy</button>
                            <button className="save" onClick={saveNote}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}