// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
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

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart School Bus Tracking API',
    version: '1.0.0',
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
      notification: '/api/notification'
    }
  });
});

// API Routes
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   🚌 Smart School Bus Tracking API Server            ║
║   📡 Server running on http://localhost:${PORT}        ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   📅 Started at: ${new Date().toLocaleString()}       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;