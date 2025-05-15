const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables first with explicit path
dotenv.config({ path: './.env' });

// Then require modules that need environment variables
const { testConnection } = require('./config/database');

// Debug environment variables
console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[REDACTED]' : 'undefined');
console.log('DB_NAME:', process.env.DB_NAME);

// Import routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const habitRoutes = require('./routes/habit.route');
const checkinRoutes = require('./routes/checkin.route');
const analyticsRoutes = require('./routes/analytics.route');
const quoteRoutes = require('./routes/quote.route');
const categoryRoutes = require('./routes/category.route');
const templateRoutes = require('./routes/template.route');
const activityRoutes = require('./routes/activity.route');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/activities', activityRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the full-stack application API' });
});

// Debug route to check cookies
app.get('/api/debug/cookies', (req, res) => {
  console.log('Cookies:', req.cookies);
  res.json({
    cookies: req.cookies,
    message: 'Check server console for cookie details'
  });
});

// Test route for API
app.post('/api/test', (req, res) => {
  console.log('Test route hit');
  console.log('Request body:', req.body);
  res.status(201).json({ message: 'Test successful', data: req.body });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Test database connection
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('Database connection successful');
    } else {
      console.error('Database connection failed');
    }
  } catch (error) {
    console.error('Error testing database connection:', error.message);
    console.error(error.stack);
  }
});

module.exports = app;