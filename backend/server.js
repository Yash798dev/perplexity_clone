const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const searchRoutes = require('./routes/search.routes');
const { errorHandler } = require('./middleware/error.middleware');

// Fail fast if JWT_SECRET is the known insecure default in production
if (process.env.NODE_ENV === 'production') {
  const insecureDefault = 'comet_clone_super_secret_jwt_key_change_in_production_2024';
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === insecureDefault) {
    console.error('[FATAL] JWT_SECRET is not set or uses the insecure default value in production. Set a strong secret in your environment variables.');
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:4200',
  'https://perplexity-clone-xvkc.onrender.com'
];

// Manual CORS middleware — fires before everything, guarantees headers are set
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowed =
    !origin ||
    allowedOrigins.includes(origin) ||
    origin.startsWith('http://localhost:');

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Respond immediately to preflight — no further processing needed
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/search', searchRoutes);

// Base route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

// Only start the server if this file is run directly (not imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
