// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";
import "../pages/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Kiểm tra sessionExpired khi component mount
  useEffect(() => {
    console.log("✅ Login component mounted!");

    const sessionExpired = localStorage.getItem("sessionExpired");
    console.log("🔍 sessionExpired:", sessionExpired);

    if (sessionExpired === "true") {
      console.log("⚠️ Hiển thị toast hết phiên!");

      toast.warning("Hết phiên đăng nhập!", {
        position: "top-center",
        autoClose: 4000,
        onClose: () => {
          console.log("🗑 Xóa flag sessionExpired sau khi toast đóng");
          localStorage.removeItem("sessionExpired");
        },
      });
    }
  }, []);

  const redirectToRolePage = (role) => {
    switch (role) {
      case "school":
        navigate("/school/dashboard", { replace: true });
        break;
      case "parent":
        navigate("/parent", { replace: true });
        break;
      case "driver":
        navigate("/driver", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.success) {
        const { user } = response.data;
        console.log("Đăng nhập thành công:", user);

        redirectToRolePage(user.role);
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Email hoặc mật khẩu không đúng");
      } else if (err.code === "ERR_NETWORK") {
        setError("Không thể kết nối đến server. Vui lòng kiểm tra backend.");
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Smart School Bus Tracking</h1>
          <p>Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Nhập email của bạn..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu..."
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              <>Đăng nhập</>
            )}
          </button>

          <div className="login-footer">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
