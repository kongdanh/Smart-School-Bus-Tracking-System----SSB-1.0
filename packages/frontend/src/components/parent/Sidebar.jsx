import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/parent-sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            authService.logout();
            navigate('/login');
        }
    };

    const navItems = [
        {
            path: '/parent/dashboard',
            label: 'Dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            )
        },
        {
            path: '/parent/tracking',
            label: 'Live Tracking',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            )
        },
        {
            path: '/parent/history',
            label: 'Trip History',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
            )
        },
        {
            path: '/parent/communication',
            label: 'Support',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            )
        },
        {
            path: '/parent/notifications',
            label: 'Notifications',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            )
        },
        {
            path: '/parent/settings',
            label: 'Settings',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m8.66-15.66-4.24 4.24m-4.84 4.84-4.24 4.24M23 12h-6m-6 0H1m20.66 8.66-4.24-4.24m-4.84-4.84-4.24-4.24" />
                </svg>
            )
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                {/* Logo Section */}
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">SR</div>
                        {isOpen && (
                            <div className="logo-text">
                                <div className="logo-brand">SafeRoute</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            title={item.label}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {isOpen && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="sidebar-footer">
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <span className="nav-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </span>
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;