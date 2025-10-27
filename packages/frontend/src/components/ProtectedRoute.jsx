// frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService";

export default function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập nhưng không có quyền
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '80px' }}>🚫</div>
        <h1 style={{ margin: 0, color: '#333' }}>Không có quyền truy cập</h1>
        <p style={{ color: '#666', margin: '10px 0' }}>
          Bạn không có quyền truy cập trang này.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => window.history.back()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ← Quay lại
          </button>
          <button 
            onClick={() => authService.logout()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  return children;
}