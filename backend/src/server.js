require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const workspaceRoutes = require('./routes/workspaces');
const aiRoutes = require('./routes/ai');
const checkinRoutes = require('./routes/checkins');
const userRoutes = require('./routes/users');
const meetupRoutes = require('./routes/meetups');

const app = express();
const PORT = process.env.PORT || 3001;

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for now to fix CORS issue
    callback(null, true);
  },
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'AI rate limit exceeded. Please wait a moment.' }
});

app.use('/api/', limiter);
app.use('/api/ai/', aiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NomadNest GoaAI API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetups', meetupRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🌊 NomadNest GoaAI API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
