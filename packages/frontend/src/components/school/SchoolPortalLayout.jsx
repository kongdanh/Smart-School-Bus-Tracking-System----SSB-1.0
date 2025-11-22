import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SchoolSidebar from './SchoolSidebar';
import '../../styles/school-styles/school-portal-layout.css';

const SchoolPortalLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="school-portal-layout">
            <SchoolSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <header className="portal-header">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="header-title">
                        <h1>Smart School Bus Management</h1>
                    </div>

                    <div className="header-right">
                        <button className="notification-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <span className="notification-badge">3</span>
                        </button>

                        <div className="user-profile">
                            <div className="user-avatar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div className="user-info">
                                <span className="user-name">School Admin</span>
                                <span className="user-role">Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="portal-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SchoolPortalLayout;