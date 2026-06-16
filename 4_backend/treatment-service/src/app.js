require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const treatmentRoutes = require('./routes/treatmentRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/treatment', treatmentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'treatment-service' });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api/treatment/:cropType/:diseaseName',
      'GET /api/treatment?cropType=tomato',
      'GET /health',
    ],
  });
});

const PORT = process.env.PORT || 3002;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`💊 Treatment Service running on http://localhost:${PORT}`);
    console.log(`   GET http://localhost:${PORT}/api/treatment/:cropType/:diseaseName`);
    console.log(`   GET http://localhost:${PORT}/api/treatment?cropType=tomato`);
  });
});

module.exports = app;