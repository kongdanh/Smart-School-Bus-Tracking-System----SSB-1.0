// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Parent from "./pages/Parent";
import ParentMap from "./pages/ParentMap";
import Driver from "./pages/Driver";
import SchoolDashboard from "./pages/SchoolDashboard";
import SchoolStudents from "./pages/SchoolStudents";
import SchoolDrivers from "./pages/SchoolDrivers";
import SchoolBuses from "./pages/SchoolBuses";
import SchoolRoutes from "./pages/SchoolRoutes";
import SchoolTracking from "./pages/SchoolTracking";
import SchoolNotifications from "./pages/SchoolNotifications";
import ProtectedRoute from "./components/ProtectedRoute";
import authService from "./services/authService";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes - Phụ huynh */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <Parent />
            </ProtectedRoute>
          }
        />

        {/* Route bản đồ cho phụ huynh */}
        <Route
          path="/parent/map"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentMap />
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Tài xế */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <Driver />
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Quản lý (Nhà trường) */}
        <Route
          path="/school/dashboard"
          element={
            <ProtectedRoute allowedRoles={["school"]}>
              <SchoolDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/students"
          element={
            <ProtectedRoute allowedRoles={["school"]}>
              <SchoolStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/drivers"
          element={
            <ProtectedRoute allowedRoles={["school"]}>
              <SchoolDrivers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/buses"
          element={
            <ProtectedRoute allowedRoles={["school"]}>
              <SchoolBuses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/routes"
          element={
            <ProtectedRoute allowedRoles={["school"]}>
              <SchoolRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/tracking"
          element={
            <ProtectedRoute allowedRoles={["school"]}>
              <SchoolTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/notifications"
          element={
            <ProtectedRoute allowedRoles={["school"]}>
              <SchoolNotifications />
            </ProtectedRoute>
          }
        />

        {/* Redirect root based on authentication */}
        <Route
          path="/"
          element={
            authService.isAuthenticated() ? (
              (() => {
                const user = authService.getCurrentUser();
                switch (user?.role) {
                  case "school":
                    return <Navigate to="/school/dashboard" replace />;
                  case "parent":
                    return <Navigate to="/parent" replace />;
                  case "driver":
                    return <Navigate to="/driver" replace />;
                  default:
                    return <Navigate to="/login" replace />;
                }
              })()
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 page */}
        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <h1 style={{ fontSize: "100px", margin: 0 }}>404</h1>
              <p style={{ fontSize: "24px", color: "#666" }}>
                Không tìm thấy trang
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ← Về trang chủ
              </button>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
