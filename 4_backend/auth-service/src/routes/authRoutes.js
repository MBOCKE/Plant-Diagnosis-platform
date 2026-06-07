const router = require('express').Router();
router.post('/login', (req, res) => res.json({ token: null }));
module.exports = router;
