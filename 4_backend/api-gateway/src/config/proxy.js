const { createProxyMiddleware } = require('http-proxy-middleware');

const setupProxies = (app) => {
  // Auth Service
  app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3004',
    changeOrigin: true,
    pathRewrite: {},
  }));

  // Treatment Service
  app.use('/api/treatment', createProxyMiddleware({
    target: process.env.TREATMENT_SERVICE_URL || 'http://127.0.0.1:3002',
    changeOrigin: true,
  }));

  // Case Service
  app.use('/api/cases', createProxyMiddleware({
    target: process.env.CASE_SERVICE_URL || 'http://127.0.0.1:3003',
    changeOrigin: true,
  }));

  // Inference Service
  app.use('/api/inference', createProxyMiddleware({
    target: process.env.INFERENCE_SERVICE_URL || 'http://127.0.0.1:5000',
    changeOrigin: true,
    pathRewrite: { '^/api/inference': '' },
  }));
};

module.exports = setupProxies;