import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Parent from "./pages/Parent";
import Driver from "./pages/Driver";
import School from "./pages/School";
import ParentMap from "./pages/ParentMap"; // ✅ thêm dòng này

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/parent/map" element={<ParentMap />} /> {/* ✅ thêm route mới */}
        <Route path="/driver" element={<Driver />} />
        <Route path="/school" element={<School />} />
      </Routes>
    </BrowserRouter>
  );
}
