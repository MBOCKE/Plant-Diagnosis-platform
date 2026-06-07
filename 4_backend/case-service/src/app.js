const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Case Service'));
module.exports = app;
