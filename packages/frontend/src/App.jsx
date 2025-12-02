import React, { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import các trang và component
// login page
import Login from "./pages/Login";

// driver pages and layout
import DriverLayout from './components/driver/DriverLayout';
import DriverDashboardPage from './components/driver/DriverDashboard';
import DriverAttendance from './pages/driver/Attendance';
import DriverCheckInOut from './pages/driver/CheckInOut';
import DriverSettings from './pages/driver/Settings';
import DriverRoutes from './pages/driver/Routes';
import DriverBustatus from './pages/driver/BusStatus';
import DriverNotifications from './pages/driver/Notifications';

// school pages and layout
import SchoolPortalLayout from "./components/school/SchoolPortalLayout";
import SchoolDashboard from "./pages/school/Dashboard";
import SchoolStudents from "./pages/school/Students";
import SchoolDrivers from "./pages/school/Drivers";
import SchoolBuses from "./pages/school/Buses";
import SchoolRoutes from "./pages/school/Routes";
import SchoolTracking from "./pages/school/Tracking";
import SchoolNotifications from "./pages/school/Notifications";

// protected route component
import ProtectedRoute from "./components/ProtectedRoute";
import authService from "./services/authService";

// parent pages and layout
import ParentPortal from './pages/parent/ParentPortal';
import ParentDashboard from './pages/parent/Dashboard';
import ParentTracking from './pages/parent/Tracking';
import ParentHistory from './pages/parent/History';
import ParentCommunication from './pages/parent/Communication';
import ParentNotifications from './pages/parent/Notifications';
import ParentSettings from './pages/parent/Settings';
import "./globals.css";

// Hàm xác định redirect dựa trên role
const getRedirectPath = (user) => {
  if (!user || !user.role) return "/login";
  switch (user.role) {
    case "school":
      return "/school/dashboard";
    case "parent":
      return "/parent/dashboard";
    case "driver":
      return "/driver/dashboard";  // ✅ FIXED: Thay đổi từ "/driver" thành "/driver/dashboard"
    default:
      return "/login";
  }
};

// Component hiển thị toast chào mừng (chỉ 1 lần)
const WelcomeToast = () => {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    if (localStorage.getItem("showWelcomeToast") === "true") {
      localStorage.removeItem("showWelcomeToast");
      hasShown.current = true;

      const user = authService.getCurrentUser();
      const userName = user?.hoTen || user?.name || user?.email || "bạn";

      toast.success(`Chào ${userName}!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, []);

  return null;
};

// Component xử lý redirect root
const RootRedirect = () => {
  const user = authService.getCurrentUser();
  const redirectPath = getRedirectPath(user);
  return <Navigate to={redirectPath} replace />;
};

// Component 404
const NotFound = () => {
  const location = useLocation();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fa",
        color: "#333",
      }}
    >
      <h1 style={{ fontSize: "100px", margin: 0, color: "#e74c3c" }}>404</h1>
      <p style={{ fontSize: "24px", color: "#666" }}>
        Không tìm thấy trang: <code>{location.pathname}</code>
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#4a6fa5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "500",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        Về trang chủ
      </button>
    </div>
  );
};

function App() {
  // Bắt đầu auto logout khi đã đăng nhập
  useEffect(() => {
    if (authService.isAuthenticated()) {
      // startAutoLogoutTimer();
    }
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <WelcomeToast />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Phụ huynh - Parent routes with ParentPortal layout */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={["parent"]}>
                <ParentPortal />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="tracking" element={<ParentTracking />} />
            <Route path="history" element={<ParentHistory />} />
            <Route path="communication" element={<ParentCommunication />} />
            <Route path="notifications" element={<ParentNotifications />} />
            <Route path="settings" element={<ParentSettings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Tài xế - Driver Portal với Layout */}
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <DriverLayout />
              </ProtectedRoute>
            }
          >
            {/* ✅ FIXED: Thay đổi index route để redirect đến dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DriverDashboardPage />} />
            <Route path="attendance" element={<DriverAttendance />} />
            <Route path="check-in-out" element={<DriverCheckInOut />} />
            <Route path="settings" element={<DriverSettings />} />
            <Route path="routes" element={<DriverRoutes />} />
            <Route path="notifications" element={<DriverNotifications />} />
            <Route path="bus-status" element={<DriverBustatus />} />
            {/* Thêm các route khác nếu cần */}
          </Route>

          {/* Nhà trường - School routes with SchoolPortalLayout */}
          <Route
            path="/school"
            element={
              <ProtectedRoute allowedRoles={["school"]}>
                <SchoolPortalLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SchoolDashboard />} />
            <Route path="students" element={<SchoolStudents />} />
            <Route path="drivers" element={<SchoolDrivers />} />
            <Route path="buses" element={<SchoolBuses />} />
            <Route path="routes" element={<SchoolRoutes />} />
            <Route path="tracking" element={<SchoolTracking />} />
            <Route path="notifications" element={<SchoolNotifications />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;