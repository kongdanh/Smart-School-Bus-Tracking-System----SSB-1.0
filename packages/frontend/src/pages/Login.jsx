import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

export default function Login() {
  const [role, setRole] = useState("parent");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/${role}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          {/* <img
            src="/bus.png"
            alt="Bus Logo"
            className="login-logo"
          /> */}
          <h1>Smart School Bus Tracking</h1>
          <p>Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Nhập email..." required defaultValue={"a@123"} />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" placeholder="Nhập mật khẩu..." required defaultValue={"123"} />
          </div>

          <div className="form-group">
            <label>Vai trò</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="parent">👨‍👩‍👧‍👦 Phụ huynh</option>
              <option value="school">🏫 Nhà trường</option>
              <option value="driver">🚌 Tài xế</option>
            </select>
          </div>

          <button type="submit" className="login-btn">
            🚍 Đăng nhập
          </button>

          <div className="login-footer">
            <a href="#">Quên mật khẩu?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
