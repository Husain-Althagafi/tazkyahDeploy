require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const personRoutes = require('./routes/personRoutes');

const app = express();

// Database connection
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);

// Production configuration
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React app
  app.use(express.static(path.join(__dirname, '../../build')));
  
  // Handle React routing - must come last
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

module.exports = app;