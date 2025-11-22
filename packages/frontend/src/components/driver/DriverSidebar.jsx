// src/components/driver/DriverSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import '../../styles/driver-styles/driver-sidebar.css';

const DriverSidebar = ({ isOpen, onToggle, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        toast.success("Đã đăng xuất thành công!");
        navigate("/login");
    };

    const menuItems = [
        { to: "/driver", icon: "dashboard", label: "Tổng quan" },
        { to: "/driver/checkinout", icon: "checkin", label: "Điểm danh" },
        { to: "/driver/attendance", icon: "attendance", label: "Chấm công" },
        { to: "/driver/routes", icon: "route", label: "Tuyến đường" },
        { to: "/driver/bus-status", icon: "bus", label: "Trạng thái xe", badge: false },
        { to: "/driver/notifications", icon: "bell", label: "Thông báo", badge: 3 },
        { to: "/driver/settings", icon: "settings", label: "Cài đặt" },
    ];

    return (
        <aside className={`driver-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 17L12 5L16 17M10 12H14M3 21H21" />
                        </svg>
                    </div>
                    <span className="logo-text">Tài xế</span>
                </div>
                <button className="toggle-btn" onClick={onToggle}>
                    <svg viewBox="0 0 24 24">
                        <path d="M15 18L9 12L15 6" />
                    </svg>
                </button>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        end
                    >
                        <div className="item-icon">
                            {item.icon === "dashboard" && (
                                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
                            )}
                            {item.icon === "checkin" && (
                                <svg viewBox="0 0 24 24"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" /></svg>
                            )}
                            {item.icon === "attendance" && (
                                <svg viewBox="0 0 24 24"><path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" /></svg>
                            )}
                            {item.icon === "route" && (
                                <svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M18 6H10C8.34315 6 7 7.34315 7 9V15C7 16.6569 8.34315 18 10 18H18" /></svg>
                            )}
                            {item.icon === "bus" && (
                                <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M5 9H19" /></svg>
                            )}
                            {item.icon === "bell" && (
                                <svg viewBox="0 0 24 24"><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" /><path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" /></svg>
                            )}
                            {item.icon === "settings" && (
                                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15C19.4 15.8 19.2 16.5 18.8 17.1L20 20L17.1 21.2L15.9 18.3C15.3 18.7 14.6 19 13.8 19.1L13.4 21H10.6L10.2 19.1C9.4 19 8.7 18.7 8.1 18.3L6.9 21.2L4 20L5.2 17.1C4.8 16.5 4.6 15.8 4.6 15V9C4.6 8.2 4.8 7.5 5.2 6.9L4 4L6.9 2.8L8.1 5.7C8.7 5.3 9.4 5 10.2 4.9L10.6 3H13.4L13.8 4.9C14.6 5 15.3 5.3 15.9 5.7L17.1 2.8L20 4L18.8 6.9C19.2 7.5 19.4 8.2 19.4 9V15Z" /></svg>
                            )}
                        </div>
                        <span className="item-label">{item.label}</span>
                        {item.badge && <span className="badge">{item.badge}</span>}
                    </NavLink>
                ))}

                {/* NÚT ĐĂNG XUẤT */}
                <button onClick={handleLogout} className="sidebar-item logout">
                    <div className="item-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>
                    <span className="item-label">Đăng xuất</span>
                </button>
            </nav>
        </aside>
    );
};

export default DriverSidebar;