const router = require('express').Router();
const authController = require('../authController');
const applicationController = require('../applicationController');
const userController = require('../userController');
///////////////////////////////////////////////////////////////////////////////////////////////////
const env = process.env;
router.all('/', (req, res) =>
    res.json({apiName: env.APINAME, apiVersion: env.APIVERSION, apiRoot: env.APIROOT, apiStatus: env.APISTATUS})
);

// Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/connection_activation', authController.connectionActivation);
router.post('/auth/disconnect', authController.disconnect);
router.post('/auth/revokeconnections', authController.revokeConnections);

// Applications API
router.get('/app/fetch/:id', applicationController.fetch);
router.get('/app/connectionsource/:connection', applicationController.connectionsource);

// User Routes
router.get('/user/verify', userController.verify);
router.post('/user/verifycode', userController.verifyCode);
router.get('/user/fetch', userController.fetch);
router.post('/user/update', userController.update);
router.post('/user/delete_properties', userController.deleteProperties);


///////////////////////////////////////////////////////////////////////////////////////////////////
router.use(require('./specific'));
module.exports = router;

