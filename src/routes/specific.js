const router = require('express').Router();
const authController = require('../authController');
const applicationController = require('../applicationController');
const userController = require('../userController');

router.all('*', (req, res) => res.status(404).json({status: 404, error: 'not found'}));

module.exports = router;