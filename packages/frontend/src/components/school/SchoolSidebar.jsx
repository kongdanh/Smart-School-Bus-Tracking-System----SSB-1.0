import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/school-styles/school-sidebar.css';

const SchoolSidebar = ({ isOpen, onToggle }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            authService.logout();
            navigate('/login');
        }
    };

    const menuItems = [
        {
            path: '/school/dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            label: 'Dashboard'
        },
        {
            path: '/school/students',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            label: 'Students'
        },
        {
            path: '/school/drivers',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
            ),
            label: 'Drivers'
        },
        {
            path: '/school/buses',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            ),
            label: 'Buses'
        },
        {
            path: '/school/routes',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="6" cy="19" r="3" />
                    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                    <circle cx="18" cy="5" r="3" />
                </svg>
            ),
            label: 'Routes'
        },
        {
            path: '/school/stops',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            label: 'Stops'
        },
        {
            path: '/school/schedules',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
            label: 'Schedules'
        },
        {
            path: '/school/tracking',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            label: 'Tracking'
        },
        {
            path: '/school/notifications',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            ),
            label: 'Messages',
            badge: 5
        }
    ];

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onToggle}
            />

            <aside className={`school-sidebar ${!isOpen ? 'closed' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-content">
                        <div className="logo-icon">🏫</div>
                        <span className="logo-text">School Portal</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <div key={index} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.label}</span>
                                {item.badge && <span className="nav-badge">{item.badge}</span>}
                            </NavLink>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-button" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SchoolSidebar;