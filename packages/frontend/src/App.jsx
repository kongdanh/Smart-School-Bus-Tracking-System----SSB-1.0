import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Parent from "./pages/Parent";
import Driver from "./pages/Driver";
import School from "./pages/School";
import ParentMap from "./pages/ParentMap";
import SchoolDashboard from "./pages/SchoolDashboard";
import SchoolStudents from "./pages/SchoolStudents";
import SchoolDrivers from "./pages/SchoolDrivers";
import SchoolBuses from "./pages/SchoolBuses";
import SchoolRoutes from "./pages/SchoolRoutes";
import SchoolTracking from "./pages/SchoolTracking";
import SchoolNotifications from "./pages/SchoolNotifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/parent/map" element={<ParentMap />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/school" element={<School />} />
        <Route path="/school/dashboard" element={<SchoolDashboard />} />
        <Route path="/school/students" element={<SchoolStudents />} />
        <Route path="/school/drivers" element={<SchoolDrivers />} />
        <Route path="/school/buses" element={<SchoolBuses />} />
        <Route path="/school/routes" element={<SchoolRoutes />} />
        <Route path="/school/tracking" element={<SchoolTracking />} />
        <Route path="/school/notifications" element={<SchoolNotifications />} />
      </Routes>
    </BrowserRouter>
  );
}