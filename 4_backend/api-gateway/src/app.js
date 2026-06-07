// Minimal API gateway entry
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('API Gateway'));
module.exports = app;
