import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/parent-settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [profileData, setProfileData] = useState({
    fullName: 'Nguyễn Văn Parent',
    email: 'parent@example.com',
    phone: '+84 901 234 567'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    pickup: true,
    arrival: true,
    alerts: true,
    newsletter: false
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const tabs = [
    {
      id: 'account',
      label: 'Account',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      id: 'help',
      label: 'Help',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="settings-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <svg className="tab-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'account' && (
            <div className="settings-section account-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>Profile Information</h2>
                  <p>Update your account details and information</p>
                </div>
              </div>

              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {profileData.fullName.charAt(0)}
                </div>
                <div className="avatar-actions">
                  <button className="btn-upload">Upload Photo</button>
                  <button className="btn-remove">Remove</button>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                {isEditing ? (
                  <>
                    <button className="btn-save" onClick={handleSaveChanges}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Save Changes
                    </button>
                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section notifications-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>Notification Settings</h2>
                  <p>Manage your notification preferences</p>
                </div>
              </div>

              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <div className="notification-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>
                    <div>
                      <h4>Pickup Notifications</h4>
                      <p>Get notified when your child is picked up</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.pickup}
                      onChange={() => handleNotificationChange('pickup')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <div className="notification-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div>
                      <h4>Arrival Notifications</h4>
                      <p>Get notified when your child arrives at destination</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.arrival}
                      onChange={() => handleNotificationChange('arrival')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <div className="notification-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <h4>Alert Notifications</h4>
                      <p>Get notified about delays and important alerts</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.alerts}
                      onChange={() => handleNotificationChange('alerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <div className="notification-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <h4>Newsletter</h4>
                      <p>Receive news and updates about SafeRoute</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={() => handleNotificationChange('newsletter')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section security-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>Security Settings</h2>
                  <p>Keep your account safe and secure</p>
                </div>
              </div>

              <div className="security-options">
                <button className="security-option">
                  <div className="option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="option-content">
                    <h4>Change Password</h4>
                    <p>Update your password regularly for better security</p>
                  </div>
                  <svg className="option-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                <button className="security-option">
                  <div className="option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                  <div className="option-content">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <svg className="option-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                <button className="security-option">
                  <div className="option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div className="option-content">
                    <h4>Login Activity</h4>
                    <p>View recent login history and devices</p>
                  </div>
                  <svg className="option-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="settings-section help-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>Support & Help</h2>
                  <p>Get assistance when you need it</p>
                </div>
              </div>

              <div className="help-cards">
                <div className="help-card">
                  <div className="help-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <h4>Email Support</h4>
                  <p>support@saferoute.com</p>
                </div>

                <div className="help-card">
                  <div className="help-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <h4>Phone Support</h4>
                  <p>+84 900 123 456</p>
                </div>

                <div className="help-card">
                  <div className="help-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h4>Business Hours</h4>
                  <p>Mon-Fri: 8AM - 6PM<br />Sat: 9AM - 3PM</p>
                </div>
              </div>

              <div className="help-actions">
                <button className="btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Chat with Support
                </button>
                <button className="btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  FAQ & Documentation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;