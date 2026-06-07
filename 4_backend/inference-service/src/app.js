const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Inference Service'));
module.exports = app;
