const router = require('express').Router();
const authController = require('../authController');
const userController = require('../userController');
///////////////////////////////////////////////////////////////////////////////////////////////////
const env = process.env;
router.all('/', (req, res) =>
    res.json({apiName: env.APINAME, apiVersion: env.APIVERSION, apiRoot: env.APIROOT, apiStatus: env.APISTATUS})
);

///////////////////////////////////////////////////////////////////////////////////////////////////
// Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/connection_activation', authController.connectionActivation);

///////////////////////////////////////////////////////////////////////////////////////////////////
// User Routes
router.get('/user/verify', userController.verify)
router.get('/user/fetch', userController.fetch)
router.get('/user/update', userController.update)

///////////////////////////////////////////////////////////////////////////////////////////////////
router.use(require('./specific'));
module.exports = router;

