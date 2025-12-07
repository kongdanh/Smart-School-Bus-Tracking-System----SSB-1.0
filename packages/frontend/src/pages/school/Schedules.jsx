import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Bus,
    User,
    Users,
    Plus,
    Edit,
    Trash2,
    X,
    Check,
    ChevronLeft,
    ChevronRight,
    Filter,
    MoreHorizontal,
    Lock
} from 'lucide-react';
import scheduleService from '../../services/scheduleService';
import schoolService from '../../services/schoolService';
import '../../styles/school-styles/school-schedules.css';

const Schedules = () => {
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month' | 'list' | 'driver-grid'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(false);

    // Resources
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);

    // Form Data
    const [formData, setFormData] = useState({
        maLich: '',
        ngay: new Date().toISOString().split('T')[0],
        gioKhoiHanh: '06:00',
        gioKetThuc: '07:00',
        tuyenDuongId: '',
        xeBuytId: '',
        taiXeId: '',
        studentIds: [],
        ghiChu: '',
        isRecurring: false,
        recurringWeeks: 1,
        recurringDays: []
    });

    // Fetch Data
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [schedulesRes, busesRes, driversRes, routesRes, studentsRes] = await Promise.all([
                scheduleService.getAllSchedules(),
                schoolService.getAllBuses(),
                schoolService.getAllDrivers(),
                schoolService.getAllRoutes(),
                schoolService.getAllStudents()
            ]);

            setSchedules(schedulesRes.data || []);
            setBuses(busesRes.data || []);
            setDrivers(driversRes.data || []);
            setRoutes(routesRes.data || []);
            setStudents(studentsRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // Conflict Detection
    const getConflicts = (date, startTime, endTime, excludeId = null) => {
        if (!date || !startTime || !endTime) return { busyBuses: new Set(), busyDrivers: new Set() };

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        const busyBuses = new Set();
        const busyDrivers = new Set();

        schedules.forEach(sch => {
            if (excludeId && sch.lichTrinhId === excludeId) return;

            const schDate = new Date(sch.ngay).toISOString().split('T')[0];
            if (schDate !== date) return;

            let schStart, schEnd;
            if (typeof sch.gioKhoiHanh === 'string' && sch.gioKhoiHanh.includes('T')) {
                schStart = new Date(sch.gioKhoiHanh);
                schEnd = new Date(sch.gioKetThuc);
            } else {
                schStart = new Date(`${date}T${sch.gioKhoiHanh.substring(11, 19)}`);
                schEnd = new Date(`${date}T${sch.gioKetThuc.substring(11, 19)}`);
            }

            // Normalize to compare time only
            const s1 = start.getHours() * 60 + start.getMinutes();
            const e1 = end.getHours() * 60 + end.getMinutes();
            const s2 = schStart.getHours() * 60 + schStart.getMinutes();
            const e2 = schEnd.getHours() * 60 + schEnd.getMinutes();

            if (s1 < e2 && e1 > s2) {
                if (sch.xeBuytId) busyBuses.add(sch.xeBuytId);
                if (sch.taiXeId) busyDrivers.add(sch.taiXeId);
            }
        });

        return { busyBuses, busyDrivers };
    };

    const { busyBuses, busyDrivers } = useMemo(() => {
        if (!isModalOpen) return { busyBuses: new Set(), busyDrivers: new Set() };
        return getConflicts(formData.ngay, formData.gioKhoiHanh, formData.gioKetThuc, editingId);
    }, [formData.ngay, formData.gioKhoiHanh, formData.gioKetThuc, isModalOpen, editingId, schedules]);

    // Handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDayToggle = (dayIndex) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const days = prev.recurringDays.includes(dayIndex)
                ? prev.recurringDays.filter(d => d !== dayIndex)
                : [...prev.recurringDays, dayIndex];
            return { ...prev, recurringDays: days };
        });
    };

    const handleStudentToggle = (studentId) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const ids = prev.studentIds.includes(studentId)
                ? prev.studentIds.filter(id => id !== studentId)
                : [...prev.studentIds, studentId];
            return { ...prev, studentIds: ids };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isReadOnly) return;

        if (busyBuses.has(parseInt(formData.xeBuytId))) {
            toast.error("Selected bus is busy at this time!");
            return;
        }
        if (busyDrivers.has(parseInt(formData.taiXeId))) {
            toast.error("Selected driver is busy at this time!");
            return;
        }

        try {
            if (editingId) {
                await scheduleService.updateSchedule(editingId, formData);
                toast.success("Schedule updated successfully");
            } else {
                let payload = { ...formData };

                if (formData.isRecurring && formData.recurringWeeks > 0 && formData.recurringDays.length > 0) {
                    const generatedDates = [];
                    // Parse date manually to avoid timezone issues (treat as local date)
                    const [y, m, d] = formData.ngay.split('-').map(Number);
                    const start = new Date(y, m - 1, d);

                    const end = new Date(start);
                    end.setDate(end.getDate() + (formData.recurringWeeks * 7));

                    // Loop through each day from start to end
                    for (let curr = new Date(start); curr < end; curr.setDate(curr.getDate() + 1)) {
                        if (formData.recurringDays.includes(curr.getDay())) {
                            // Format as YYYY-MM-DD using local time
                            const year = curr.getFullYear();
                            const month = String(curr.getMonth() + 1).padStart(2, '0');
                            const day = String(curr.getDate()).padStart(2, '0');
                            generatedDates.push(`${year}-${month}-${day}`);
                        }
                    }

                    if (generatedDates.length === 0) {
                        toast.error("No dates generated for recurring schedule. Check your selected days.");
                        return;
                    }
                    payload.dates = generatedDates;
                }
                await scheduleService.createSchedule(payload);
                toast.success("Schedule created successfully");
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id, date) => {
        const scheduleDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (scheduleDate <= today) {
            toast.warning("Cannot delete past schedules.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this schedule?")) {
            try {
                await scheduleService.deleteSchedule(id);
                toast.success("Schedule deleted");
                fetchInitialData();
            } catch (error) {
                toast.error("Failed to delete schedule");
            }
        }
    };

    const openModal = (schedule = null, date = null) => {
        const targetDate = schedule ? new Date(schedule.ngay) : (date || new Date());
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const readOnly = targetDate <= today;
        setIsReadOnly(readOnly);

        if (readOnly && !schedule) {
            toast.warning("Cannot create schedules for past dates.");
            return;
        }

        if (schedule) {
            setEditingId(schedule.lichTrinhId);
            setFormData({
                maLich: schedule.maLich,
                ngay: new Date(schedule.ngay).toISOString().split('T')[0],
                gioKhoiHanh: new Date(schedule.gioKhoiHanh).toTimeString().slice(0, 5),
                gioKetThuc: new Date(schedule.gioKetThuc).toTimeString().slice(0, 5),
                tuyenDuongId: schedule.tuyenDuongId,
                xeBuytId: schedule.xeBuytId,
                taiXeId: schedule.taiXeId,
                studentIds: schedule.studentTrips?.map(st => st.hocSinhId) || [],
                ghiChu: schedule.ghiChu || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                maLich: `SCH-${Date.now()}`,
                ngay: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                gioKhoiHanh: '06:00',
                gioKetThuc: '07:00',
                tuyenDuongId: '',
                xeBuytId: '',
                taiXeId: '',
                studentIds: [],
                ghiChu: ''
            });
        }
        setIsModalOpen(true);
    };

    // --- VIEW HELPERS ---
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    const getWeekDays = (date) => {
        const start = getStartOfWeek(date);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };


    const renderDriverGridView = () => {
        const weekDays = getWeekDays(currentDate);

        return (
            <div className="driver-grid-view">
                <div className="driver-grid-header">
                    <div className="driver-column-header">Driver</div>
                    {weekDays.map((day, index) => (
                        <div key={index} className={`day-header ${day.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                            <div className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="day-date">{day.getDate()}</div>
                        </div>
                    ))}
                </div>
                <div className="driver-grid-body">
                    {drivers.map(driver => (
                        <div key={driver.taiXeId} className="driver-row">
                            <div className="driver-info-cell">
                                <div className="driver-name">{driver.hoTen}</div>
                                <div className="driver-license">{driver.bangLai}</div>
                            </div>
                            {weekDays.map((day, dayIndex) => {
                                const daySchedules = schedules.filter(s =>
                                    new Date(s.ngay).toDateString() === day.toDateString() &&
                                    s.taiXeId === driver.taiXeId
                                );

                                return (
                                    <div key={dayIndex} className="schedule-cell" onClick={() => openModal(null, day)}>
                                        {daySchedules.map(sch => (
                                            <div
                                                key={sch.lichTrinhId}
                                                className="mini-schedule-item"
                                                onClick={(e) => { e.stopPropagation(); openModal(sch); }}
                                                title={`${sch.tuyenduong?.tenTuyen} (${new Date(sch.gioKhoiHanh).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                                            >
                                                <span className="time">{new Date(sch.gioKhoiHanh).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="route">{sch.tuyenduong?.tenTuyen}</span>
                                            </div>
                                        ))}
                                        {daySchedules.length === 0 && (
                                            <div className="add-slot-btn">+</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const weekDays = getWeekDays(currentDate);
        const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 6:00 to 19:00

        // Helper to calculate layout for overlapping events
        const calculateDayLayout = (daySchedules) => {
            const sorted = [...daySchedules].sort((a, b) => {
                const startA = new Date(a.gioKhoiHanh);
                const startB = new Date(b.gioKhoiHanh);
                return startA - startB;
            });

            const clusters = [];
            let currentCluster = [];
            let clusterEnd = -1;

            sorted.forEach(ev => {
                const start = new Date(ev.gioKhoiHanh);
                const end = new Date(ev.gioKetThuc);
                const startMin = start.getHours() * 60 + start.getMinutes();
                const endMin = end.getHours() * 60 + end.getMinutes();

                const eventWithTime = { ...ev, startMin, endMin };

                if (currentCluster.length === 0) {
                    currentCluster.push(eventWithTime);
                    clusterEnd = endMin;
                } else {
                    if (startMin < clusterEnd) {
                        currentCluster.push(eventWithTime);
                        clusterEnd = Math.max(clusterEnd, endMin);
                    } else {
                        clusters.push(currentCluster);
                        currentCluster = [eventWithTime];
                        clusterEnd = endMin;
                    }
                }
            });
            if (currentCluster.length > 0) clusters.push(currentCluster);

            const results = [];
            clusters.forEach(cluster => {
                const width = 100 / cluster.length;
                cluster.forEach((ev, index) => {
                    results.push({
                        ...ev,
                        style: {
                            width: `${width}%`,
                            left: `${index * width}%`
                        }
                    });
                });
            });
            return results;
        };

        return (
            <div className="week-view-container">
                <div className="week-header">
                    <div className="time-column-header"></div>
                    {weekDays.map((day, index) => (
                        <div key={index} className={`day-header ${day.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                            <div className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="day-date">{day.getDate()}</div>
                        </div>
                    ))}
                </div>
                <div className="week-body">
                    <div className="time-column">
                        {hours.map(hour => (
                            <div key={hour} className="time-slot-label">
                                {hour}:00
                            </div>
                        ))}
                    </div>
                    <div className="days-grid">
                        {weekDays.map((day, dayIndex) => {
                            const daySchedules = schedules.filter(s =>
                                new Date(s.ngay).toDateString() === day.toDateString()
                            );

                            const layoutEvents = calculateDayLayout(daySchedules);

                            return (
                                <div key={dayIndex} className="day-column" onClick={() => openModal(null, day)}>
                                    {hours.map(hour => (
                                        <div key={hour} className="hour-cell"></div>
                                    ))}

                                    {layoutEvents.map(sch => {
                                        const start = new Date(sch.gioKhoiHanh);
                                        const end = new Date(sch.gioKetThuc);
                                        const startHour = start.getHours() + start.getMinutes() / 60;
                                        const endHour = end.getHours() + end.getMinutes() / 60;
                                        const duration = endHour - startHour;
                                        const top = (startHour - 6) * 60;
                                        const height = duration * 60;

                                        return (
                                            <div
                                                key={sch.lichTrinhId}
                                                className="event-card"
                                                style={{
                                                    top: `${top}px`,
                                                    height: `${height}px`,
                                                    ...sch.style
                                                }}
                                                onClick={(e) => { e.stopPropagation(); openModal(sch); }}
                                            >
                                                <div className="event-time">
                                                    {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="event-title">{sch.tuyenduong?.tenTuyen}</div>
                                                <div className="event-bus">{sch.xebuyt?.bienSo}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const { days, firstDay } = getDaysInMonth(currentDate);
        const monthSchedules = schedules.filter(s => {
            const d = new Date(s.ngay);
            return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        });

        const calendarDays = [];
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let d = 1; d <= days; d++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const daySchedules = monthSchedules.filter(s => new Date(s.ngay).getDate() === d);
            const isToday = new Date().getDate() === d && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

            calendarDays.push(
                <div key={d} className={`calendar-day ${isToday ? 'today' : ''}`} onClick={() => openModal(null, new Date(currentDate.getFullYear(), currentDate.getMonth(), d))}>
                    <div className="day-number">{d}</div>
                    <div className="day-content">
                        {daySchedules.slice(0, 3).map(sch => (
                            <div key={sch.lichTrinhId} className="schedule-dot-item" onClick={(e) => { e.stopPropagation(); openModal(sch); }}>
                                <span className="dot" style={{ backgroundColor: '#3b82f6' }}></span>
                                <span className="time">{new Date(sch.gioKhoiHanh).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="route-name">{sch.tuyenduong?.tenTuyen}</span>
                            </div>
                        ))}
                        {daySchedules.length > 3 && (
                            <div className="more-events">+{daySchedules.length - 3} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="calendar-grid">
                <div className="calendar-header-row">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="calendar-header-cell">{day}</div>
                    ))}
                </div>
                <div className="calendar-body">
                    {calendarDays}
                </div>
            </div>
        );
    };

    return (
        <div className="schedules-container">
            <div className="page-header">
                <div className="header-left">
                    <h1>Schedule Assignment</h1>
                    <div className="view-toggles">
                        <button
                            className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
                            onClick={() => setViewMode('week')}
                        >
                            <CalendarIcon size={18} /> Week
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                            onClick={() => setViewMode('month')}
                        >
                            <CalendarIcon size={18} /> Month
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <Users size={18} /> List
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'driver-grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('driver-grid')}
                        >
                            <User size={18} /> Driver Grid
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <div className="date-nav">
                        <button onClick={() => {
                            const newDate = new Date(currentDate);
                            if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
                            else newDate.setMonth(newDate.getMonth() - 1);
                            setCurrentDate(newDate);
                        }}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2>
                            {viewMode === 'week'
                                ? `Week of ${getStartOfWeek(currentDate).toLocaleDateString()}`
                                : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                            }
                        </h2>
                        <button onClick={() => {
                            const newDate = new Date(currentDate);
                            if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
                            else newDate.setMonth(newDate.getMonth() + 1);
                            setCurrentDate(newDate);
                        }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button className="btn-primary" onClick={() => openModal()}>
                        <Plus size={18} /> Assign Schedule
                    </button>
                </div>
            </div>

            <div className="view-content">
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'list' && (
                    <div className="list-view">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Route</th>
                                    <th>Bus</th>
                                    <th>Driver</th>
                                    <th>Students</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map(sch => (
                                    <tr key={sch.lichTrinhId}>
                                        <td>{new Date(sch.ngay).toLocaleDateString()}</td>
                                        <td>
                                            {new Date(sch.gioKhoiHanh).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(sch.gioKetThuc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>{sch.tuyenduong?.tenTuyen}</td>
                                        <td>{sch.xebuyt?.bienSo}</td>
                                        <td>{sch.taixe?.hoTen}</td>
                                        <td>{sch.studentTrips?.length || 0}</td>
                                        <td>
                                            <button className="action-btn edit" onClick={() => openModal(sch)}><Edit size={16} /></button>
                                            <button className="action-btn delete" onClick={() => handleDelete(sch.lichTrinhId, sch.ngay)}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {viewMode === 'driver-grid' && renderDriverGridView()}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>
                                {editingId ? 'Edit Assignment' : 'New Assignment'}
                                {isReadOnly && <span className="readonly-badge"><Lock size={16} /> Completed</span>}
                            </h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <input type="hidden" name="maLich" value={formData.maLich} />
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" name="ngay" value={formData.ngay} onChange={handleInputChange} required disabled={isReadOnly} />
                                </div>

                                {!editingId && !isReadOnly && (
                                    <div className="form-group full-width recurring-section">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="isRecurring"
                                                checked={formData.isRecurring}
                                                onChange={handleInputChange}
                                            />
                                            Repeat Schedule
                                        </label>

                                        {formData.isRecurring && (
                                            <div className="recurring-options">
                                                <div className="form-row">
                                                    <label>Repeat for (weeks):</label>
                                                    <input
                                                        type="number"
                                                        name="recurringWeeks"
                                                        min="1"
                                                        max="12"
                                                        value={formData.recurringWeeks}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="week-days-selector">
                                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                                                        <div
                                                            key={day}
                                                            className={`day-pill ${formData.recurringDays.includes(idx) ? 'selected' : ''}`}
                                                            onClick={() => handleDayToggle(idx)}
                                                        >
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input type="time" name="gioKhoiHanh" value={formData.gioKhoiHanh} onChange={handleInputChange} required disabled={isReadOnly} />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input type="time" name="gioKetThuc" value={formData.gioKetThuc} onChange={handleInputChange} required disabled={isReadOnly} />
                                </div>
                                <div className="form-group">
                                    <label>Route</label>
                                    <select name="tuyenDuongId" value={formData.tuyenDuongId} onChange={handleInputChange} required disabled={isReadOnly}>
                                        <option value="">Select Route</option>
                                        {routes.map(r => (
                                            <option key={r.tuyenDuongId} value={r.tuyenDuongId}>{r.tenTuyen}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bus</label>
                                    <select name="xeBuytId" value={formData.xeBuytId} onChange={handleInputChange} required disabled={isReadOnly}>
                                        <option value="">Select Bus</option>
                                        {buses.map(b => (
                                            <option
                                                key={b.xeBuytId}
                                                value={b.xeBuytId}
                                                disabled={busyBuses.has(b.xeBuytId)}
                                                className={busyBuses.has(b.xeBuytId) ? 'option-busy' : ''}
                                            >
                                                {b.bienSo} {busyBuses.has(b.xeBuytId) ? '(Busy)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Driver</label>
                                    <select name="taiXeId" value={formData.taiXeId} onChange={handleInputChange} required disabled={isReadOnly}>
                                        <option value="">Select Driver</option>
                                        {drivers.map(d => (
                                            <option
                                                key={d.taiXeId}
                                                value={d.taiXeId}
                                                disabled={busyDrivers.has(d.taiXeId)}
                                                className={busyDrivers.has(d.taiXeId) ? 'option-busy' : ''}
                                            >
                                                {d.hoTen} {busyDrivers.has(d.taiXeId) ? '(Busy)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Assign Students ({formData.studentIds.length} selected)</label>
                                <div className="students-selection-container">
                                    <div className="students-grid">
                                        {students.map(s => (
                                            <div
                                                key={s.hocSinhId}
                                                className={`student-card ${formData.studentIds.includes(s.hocSinhId) ? 'selected' : ''} ${isReadOnly ? 'disabled' : ''}`}
                                                onClick={() => handleStudentToggle(s.hocSinhId)}
                                            >
                                                <div className="checkbox">
                                                    {formData.studentIds.includes(s.hocSinhId) && <Check size={14} />}
                                                </div>
                                                <div className="student-info">
                                                    <span className="name">{s.hoTen}</span>
                                                    <span className="class">{s.lop}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                                {!isReadOnly && <button type="submit" className="btn-primary">Save Schedule</button>}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedules;
