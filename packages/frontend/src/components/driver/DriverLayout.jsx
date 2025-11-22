// src/components/driver/DriverLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DriverSidebar from './DriverSidebar';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import '../../styles/driver-styles/driver-portal-layout.css';

const DriverLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleLogout = () => {
        authService.logout();
        toast.success("Đã đăng xuất thành công!");
        navigate("/login");
    };

    const user = authService.getCurrentUser();
    const userName = user?.name || "Tài xế";

    return (
        <div className="driver-portal-layout">
            <DriverSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} onLogout={handleLogout} />

            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <header className="portal-header">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>

                    <div className="header-title">
                        <h1>Smart Bus Driver Portal</h1>
                        <p>Quản lý chuyến xe & điểm danh học sinh</p>
                    </div>

                    <div className="header-right">
                        <button className="notification-btn">
                            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            <span className="notification-badge">5</span>
                        </button>

                        <div className="user-profile">
                            <div className="user-avatar">
                                <img src="/avatar-driver.jpg" alt="Driver" onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=" + userName + "&background=3b82f6&color=fff"} />
                            </div>
                            <div className="user-info">
                                <span className="user-name">{userName}</span>
                                <span className="user-role">Tài xế</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="portal-main">
                    <div className="page-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DriverLayout;