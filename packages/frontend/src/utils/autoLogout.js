// frontend/src/utils/autoLogout.js

let logoutTimer = null;
let isTimerActive = false;

// Thời gian không hoạt động trước khi logout (30 phút)
// Để test: dùng 10 giây = 10 * 1000
const INACTIVITY_TIME = 10 * 60 * 1000; // 30 phút
// const INACTIVITY_TIME = 10 * 1000; // 10 giây (dùng để test)

const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];

/**
 * Bắt đầu bộ đếm auto logout
 */
export const startAutoLogoutTimer = () => {
    // Nếu timer đang chạy, không khởi động lại
    if (isTimerActive) {
        console.log("⚠️ Timer đã chạy rồi, không cần start lại");
        return;
    }

    console.log(`🟢 Auto logout timer started! (${INACTIVITY_TIME / 1000}s)`);

    isTimerActive = true;

    // Đăng ký event listeners
    events.forEach((event) => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Khởi động timer lần đầu
    resetInactivityTimer();
};

/**
 * Dọn dẹp và dừng timer
 */
export const clearAutoLogoutTimer = () => {
    console.log("🔴 Auto logout timer cleared!");

    // Clear timeout
    if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
    }

    // Remove event listeners
    events.forEach((event) => {
        document.removeEventListener(event, resetInactivityTimer);
    });

    isTimerActive = false;
};

/**
 * Reset lại thời gian đếm khi user có hoạt động
 */
const resetInactivityTimer = () => {
    // Clear timer cũ nếu có
    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }

    console.log(`⏰ Timer reset - ${INACTIVITY_TIME / 1000}s đếm ngược...`);

    // Tạo timer mới
    logoutTimer = setTimeout(() => {
        handleAutoLogout();
    }, INACTIVITY_TIME);
};

/**
 * Xử lý logout tự động
 */
const handleAutoLogout = () => {
    console.log("⚠️ HẾT THỜI GIAN! Đang logout...");

    // Xóa dữ liệu trong localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("justLoggedIn");

    // Lưu flag để Login component hiển thị thông báo
    localStorage.setItem("sessionExpired", "true");
    console.log("✅ Flag 'sessionExpired' đã được lưu!");

    // Dọn dẹp timer
    clearAutoLogoutTimer();

    // Redirect về login
    window.location.replace("/login");
};

/**
 * Kiểm tra xem timer có đang chạy không
 */
export const isAutoLogoutActive = () => {
    return isTimerActive;
};