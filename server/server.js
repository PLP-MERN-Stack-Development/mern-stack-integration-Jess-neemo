// server.js - Main server file for the MERN blog application

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST
dotenv.config();

// Add startup logs BEFORE anything else
console.log('✅ Starting server...');
console.log('✅ MONGODB_URI configured:', process.env.MONGODB_URI ? 'YES' : 'NO');
console.log('✅ JWT_SECRET configured:', process.env.JWT_SECRET ? 'YES' : 'NO');

// Validate critical env vars
if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL: MONGODB_URI is missing in environment variables.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is missing.');
  process.exit(1);
}

// Import routes AFTER env is loaded
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('MERN Blog API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Connect to MongoDB FIRST, THEN start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Start server ONLY after DB is ready
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // Keep-alive settings for cloud hosts (Railway/Render)
    server.keepAliveTimeout = 120000; // 120 seconds
    server.headersTimeout = 125000;   // slightly higher
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

module.exports = app;