import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SchoolDashboard from "../pages/SchoolDashboard";
import ParentDashboard from "../pages/ParentDashboard";
import DriverDashboard from "../pages/DriverDashboard";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/school" element={<SchoolDashboard />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/driver" element={<DriverDashboard />} />
    </Routes>
  );
};
