const router = require('express').Router();

router.all('*', (req, res) => res.status(404).json({status: 400, error: 'not found'}));

module.exports = router;