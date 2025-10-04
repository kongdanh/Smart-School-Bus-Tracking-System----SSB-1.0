// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    navigate(`/${role}`);
  };

  return (
    <div className="login-wrapper">
      {/* Left Column: Illustration */}
      <div className="illustration-section">
        <div className="content">
          <h1>Smart School Bus Tracking</h1>
          <p>Giải pháp quản lý xe đưa đón học sinh thông minh, an toàn và hiệu quả</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135790.png"
            alt="Bus Illustration"
          />
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="form-section">
        <div className="form-container">
          <h2>Đăng Nhập Hệ Thống</h2>
          <p>Vui lòng chọn vai trò của bạn để tiếp tục</p>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin("school")}
              className="login-btn school"
            >
              <span role="img" aria-label="school">🎓</span> Nhà Trường
            </button>
            <button
              onClick={() => handleLogin("parent")}
              className="login-btn parent"
            >
              <span role="img" aria-label="family">👨‍👩‍👧‍👦</span> Phụ Huynh
            </button>
            <button
              onClick={() => handleLogin("driver")}
              className="login-btn driver"
            >
              <span role="img" aria-label="bus">🚌</span> Tài Xế
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}