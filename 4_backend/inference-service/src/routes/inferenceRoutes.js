const router = require('express').Router();
router.post('/predict', (req, res) => res.json({ label: 'healthy' }));
module.exports = router;
