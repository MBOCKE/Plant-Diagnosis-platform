const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Treatment Service'));
module.exports = app;
