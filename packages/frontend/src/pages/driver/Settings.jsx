import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/driver-styles/driver-settings.css";

// Mock user data from schema
const mockUserData = {
    userId: 1,
    hoTen: "Nguyễn Văn An",
    email: "nguyenvanan@busdriver.com",
    soDienThoai: "0901234567",
    avatar: null,
    taixe: {
        taiXeId: 1,
        bienSoCapphep: "B2-12345-VN",
        gioHeBay: 4.8,
        soChuyenHT: 156
    },
    settings: {
        thongBaoEmail: true,
        thongBaoSMS: true,
        thongBaoPush: true,
        thoiBieu: "light",
        ngonNgu: "vi"
    }
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(mockUserData);
    const [activeTab, setActiveTab] = useState("profile"); // profile, notifications, preferences, security
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        hoTen: userData.hoTen,
        email: userData.email,
        soDienThoai: userData.soDienThoai
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleSaveProfile = () => {
        setUserData(prev => ({
            ...prev,
            ...editData
        }));
        setIsEditing(false);
        toast.success("Profile updated successfully!", {
            position: "bottom-right"
        });
    };

    const handleToggleNotification = (key) => {
        setUserData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [key]: !prev.settings[key]
            }
        }));
        toast.info("Notification settings updated", {
            position: "bottom-right",
            autoClose: 2000
        });
    };

    const handleThemeChange = (theme) => {
        setUserData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                thoiBieu: theme
            }
        }));

        // Apply theme (you would implement this in your app)
        document.documentElement.setAttribute('data-theme', theme);

        toast.success(`Switched to ${theme} mode`, {
            position: "bottom-right",
            autoClose: 2000
        });
    };

    const handleLanguageChange = (lang) => {
        setUserData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                ngonNgu: lang
            }
        }));
        toast.info(`Language changed to ${lang === 'vi' ? 'Vietnamese' : 'English'}`, {
            position: "bottom-right",
            autoClose: 2000
        });
    };

    const handleChangePassword = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("Please fill in all password fields", {
                position: "bottom-right"
            });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match", {
                position: "bottom-right"
            });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters", {
                position: "bottom-right"
            });
            return;
        }

        // Mock password change
        toast.success("Password changed successfully!", {
            position: "bottom-right"
        });
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    };

    return (
        <div className="settings-container">
            {/* Header */}
            <div className="settings-header">
                <button className="btn-back" onClick={() => navigate('/driver/dashboard')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <div className="header-content">
                    <h1>Settings</h1>
                    <p>Manage your account and preferences</p>
                </div>
            </div>

            <div className="settings-content">
                {/* Sidebar Tabs */}
                <div className="settings-sidebar">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        Notifications
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l-4.2 4.2M23 12h-6m-6 0H1m18-5.2l-4.2 4.2m0 6l-4.2 4.2" />
                        </svg>
                        Preferences
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Security
                    </button>
                </div>

                {/* Main Content */}
                <div className="settings-main">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Profile Information</h2>
                                {!isEditing ? (
                                    <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </button>
                                        <button className="btn-save" onClick={handleSaveProfile}>
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="profile-card">
                                <div className="avatar-section">
                                    <div className="avatar-display">
                                        {userData.avatar ? (
                                            <img src={userData.avatar} alt={userData.hoTen} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {userData.hoTen.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <button className="btn-change-avatar">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                            Change Photo
                                        </button>
                                    )}
                                </div>

                                <div className="profile-fields">
                                    <div className="field-group">
                                        <label>Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.hoTen}
                                                onChange={(e) => setEditData({ ...editData, hoTen: e.target.value })}
                                            />
                                        ) : (
                                            <p>{userData.hoTen}</p>
                                        )}
                                    </div>

                                    <div className="field-group">
                                        <label>Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            />
                                        ) : (
                                            <p>{userData.email}</p>
                                        )}
                                    </div>

                                    <div className="field-group">
                                        <label>Phone Number</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editData.soDienThoai}
                                                onChange={(e) => setEditData({ ...editData, soDienThoai: e.target.value })}
                                            />
                                        ) : (
                                            <p>{userData.soDienThoai}</p>
                                        )}
                                    </div>

                                    <div className="field-group">
                                        <label>Driver License</label>
                                        <p>{userData.taixe.bienSoCapphep}</p>
                                    </div>

                                    <div className="field-group">
                                        <label>Rating</label>
                                        <p className="rating">⭐ {userData.taixe.gioHeBay}/5.0</p>
                                    </div>

                                    <div className="field-group">
                                        <label>Completed Trips</label>
                                        <p>{userData.taixe.soChuyenHT} trips</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Notification Preferences</h2>
                            </div>

                            <div className="settings-list">
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Email Notifications</h3>
                                        <p>Receive updates via email about trips and alerts</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={userData.settings.thongBaoEmail}
                                            onChange={() => handleToggleNotification('thongBaoEmail')}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>SMS Notifications</h3>
                                        <p>Get text messages for important updates</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={userData.settings.thongBaoSMS}
                                            onChange={() => handleToggleNotification('thongBaoSMS')}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h3>Push Notifications</h3>
                                        <p>Receive push notifications on your device</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={userData.settings.thongBaoPush}
                                            onChange={() => handleToggleNotification('thongBaoPush')}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>App Preferences</h2>
                            </div>

                            <div className="preference-group">
                                <h3>Theme</h3>
                                <p className="preference-desc">Choose your preferred color scheme</p>
                                <div className="theme-options">
                                    <button
                                        className={`theme-btn ${userData.settings.thoiBieu === 'light' ? 'active' : ''}`}
                                        onClick={() => handleThemeChange('light')}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="5" />
                                            <line x1="12" y1="1" x2="12" y2="3" />
                                            <line x1="12" y1="21" x2="12" y2="23" />
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                            <line x1="1" y1="12" x2="3" y2="12" />
                                            <line x1="21" y1="12" x2="23" y2="12" />
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                        </svg>
                                        Light Mode
                                    </button>
                                    <button
                                        className={`theme-btn ${userData.settings.thoiBieu === 'dark' ? 'active' : ''}`}
                                        onClick={() => handleThemeChange('dark')}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                        </svg>
                                        Dark Mode
                                    </button>
                                </div>
                            </div>

                            <div className="preference-group">
                                <h3>Language</h3>
                                <p className="preference-desc">Select your preferred language</p>
                                <div className="language-options">
                                    <button
                                        className={`lang-btn ${userData.settings.ngonNgu === 'vi' ? 'active' : ''}`}
                                        onClick={() => handleLanguageChange('vi')}
                                    >
                                        🇻🇳 Tiếng Việt
                                    </button>
                                    <button
                                        className={`lang-btn ${userData.settings.ngonNgu === 'en' ? 'active' : ''}`}
                                        onClick={() => handleLanguageChange('en')}
                                    >
                                        🇺🇸 English
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Security Settings</h2>
                            </div>

                            <div className="security-card">
                                <h3>Change Password</h3>
                                <p className="security-desc">Update your password to keep your account secure</p>

                                <div className="password-fields">
                                    <div className="field-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        />
                                    </div>

                                    <div className="field-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        />
                                    </div>

                                    <div className="field-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        />
                                    </div>

                                    <button className="btn-change-password" onClick={handleChangePassword}>
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}