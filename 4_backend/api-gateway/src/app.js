require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// ============================================
// SECURITY
// ============================================
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many attempts. Try again in 15 min.' } });
const inferenceLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { success: false, message: 'Too many requests. Try again in 15 min.' } });
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, message: 'Too many requests.' } });

app.use('/api/auth', authLimiter);
app.use('/api/inference', inferenceLimiter);
app.use('/', globalLimiter);

// ============================================
// SERVICE URLS
// ============================================
const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3004';
const TREATMENT_URL = process.env.TREATMENT_SERVICE_URL || 'http://127.0.0.1:3002';
const CASE_URL = process.env.CASE_SERVICE_URL || 'http://127.0.0.1:3003';
const INFERENCE_URL = process.env.INFERENCE_SERVICE_URL || 'http://127.0.0.1:5000';

// ============================================
// MANUAL PROXY FUNCTION
// ============================================
async function proxyRequest(req, res, targetUrl) {
  try {
    const url = `${targetUrl}${req.originalUrl}`;
    
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (req.headers.authorization) {
      options.headers['Authorization'] = req.headers.authorization;
    }

    if (req.method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Proxy error (${targetUrl}):`, error.message);
    res.status(502).json({
      success: false,
      message: 'Service temporarily unavailable',
      error: error.message,
    });
  }
}

// ============================================
// ROUTES
// ============================================

// Auth Service
app.use('/api/auth', (req, res) => proxyRequest(req, res, AUTH_URL));

// Treatment Service
app.use('/api/treatment', (req, res) => proxyRequest(req, res, TREATMENT_URL));

// Case Service
app.use('/api/cases', (req, res) => proxyRequest(req, res, CASE_URL));

// Inference Service
app.use('/api/inference', (req, res) => {
  // Remove /api/inference prefix for the Python service
  req.originalUrl = req.originalUrl.replace('/api/inference', '');
  proxyRequest(req, res, INFERENCE_URL);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    services: { auth: AUTH_URL, treatment: TREATMENT_URL, cases: CASE_URL, inference: INFERENCE_URL },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on http://localhost:${PORT}`);
  console.log(`   Auth: ${AUTH_URL}`);
  console.log(`   Treatment: ${TREATMENT_URL}`);
  console.log(`   Cases: ${CASE_URL}`);
  console.log(`   Inference: ${INFERENCE_URL}`);
  console.log(`🔒 Rate limiting enabled`);
});