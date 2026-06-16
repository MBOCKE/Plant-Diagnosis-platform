require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');
const caseRoutes = require('./routes/caseRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.use('/api/cases', caseRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'case-service' });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`📋 Case Service running on http://localhost:${PORT}`);
    console.log(`   GET    /api/cases`);
    console.log(`   POST   /api/cases`);
    console.log(`   GET    /api/cases/:id`);
    console.log(`   PUT    /api/cases/:id/notes`);
    console.log(`   DELETE /api/cases/:id`);
    console.log(`   POST   /api/cases/sync`);
  });
});

module.exports = app;