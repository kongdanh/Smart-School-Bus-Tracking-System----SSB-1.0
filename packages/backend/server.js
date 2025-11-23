// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables trước tiên
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json({ limit: '10mb' })); // tăng limit nếu cần upload ảnh
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads folder) - ảnh xe, tài xế, học sinh...
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============ IMPORT ROUTES ============
// Routes cũ (giữ nguyên)
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const busRoutes = require('./routes/busRoutes');
const driverRoutes = require('./routes/driverRoutes');
const studentRoutes = require('./routes/studentRoutes');
const parentRoutes = require('./routes/parentRoutes');
const locationRoutes = require('./routes/locationRoutes');
const routeRoutes = require('./routes/routeRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Routes mới (thêm vào)
const attendanceRoutes = require('./routes/attendanceRoutes');
const tripRoutes = require('./routes/tripRoutes');

// ============ HEALTH CHECK & WELCOME ============
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚌 Smart School Bus Tracking API - Đã cập nhật đầy đủ routes mới!',
    version: '1.1.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      school: '/api/school',
      bus: '/api/bus',
      driver: '/api/driver',
      student: '/api/student',
      parent: '/api/parent',
      location: '/api/location',
      route: '/api/route',
      schedule: '/api/schedule',
      notification: '/api/notification',
      attendance: '/api/attendance',     // mới
      trip: '/api/trip',                 // mới
    }
  });
});

// ============ API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/route', routeRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/notification', notificationRoutes);

// === ROUTES MỚI ===
app.use('/api/attendance', attendanceRoutes);
app.use('/api/trip', tripRoutes);

// ============ ERROR HANDLING ============
// Cách 1: Dùng error middleware tùy chỉnh (nếu bạn đã có file errorMiddleware.js tốt)
try {
  const { notFound, errorHandler } = require('./middleware/errorMiddleware');
  app.use(notFound);
  app.use(errorHandler);
} catch (error) {
  // Cách 2: Nếu chưa có hoặc không muốn dùng, fallback về error handler mặc định
  console.warn('Không tìm thấy errorMiddleware, dùng error handler mặc định');

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
      path: req.originalUrl
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });
}

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`

   🚌 SMART SCHOOL BUS TRACKING API 
   🚀 Server running on http://localhost:${PORT.padEnd(4)} 
   🌍 Mode: ${process.env.NODE_ENV || 'development'} 
   ⏰ Started: ${new Date().toLocaleString('vi-VN')} 

  `.trim());
});

module.exports = app;