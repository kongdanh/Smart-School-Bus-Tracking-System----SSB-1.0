// packages/backend/middleware/roleMiddleware.js
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        // Giả lập user từ auth middleware (sau này lấy từ JWT)
        const user = req.user || { role: "admin" }; // tạm thời để admin cho test

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền truy cập chức năng này"
            });
        }
        next();
    };
};

module.exports = roleMiddleware;