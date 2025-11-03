// ⚠️ FILE TEST - logout sau 10s không hoạt động
// frontend/src/utils/autoLogout.js

let logoutTimer = null;

// thời gian đếm khi người dùng không hoạt động -> autoLogout người dùng hiện tại
const INACTIVITY_TIME = 5 * 60 * 1000;

// bộ đếm tgian
export const startAutoLogoutTimer = () => {

    // debug console
    // console.log("🟢 Auto logout timer started! (10 giây)");

    resetInactivityTimer();

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
};

export const clearAutoLogoutTimer = () => {
    console.log("🔴 Auto logout timer cleared!");
    if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
    }

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
        document.removeEventListener(event, resetInactivityTimer);
    });
};

const resetInactivityTimer = () => {
    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }

    console.log("⏰ Timer reset - 10 giây đếm ngược...");

    logoutTimer = setTimeout(() => {
        console.log("⚠️ HẾT THỜI GIAN! Đang logout...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("justLoggedIn");

        // ✅ Lưu flag để Login.jsx nhận biết và hiển thị toast
        localStorage.setItem("sessionExpired", "true");
        console.log("✅ Flag 'sessionExpired' đã được lưu!");

        clearAutoLogoutTimer();

        // ✅ Không dùng window.location.href – tránh reload cứng
        window.location.replace("/login"); // vẫn reload page nhưng ổn định hơn
    }, INACTIVITY_TIME);
};
