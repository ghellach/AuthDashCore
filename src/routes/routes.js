const router = require('express').Router();
const authController = require('../authController');
const applicationController = require('../applicationController');
const userController = require('../userController');
const statisticsController = require('../statisticsController');
///////////////////////////////////////////////////////////////////////////////////////////////////
const env = process.env;

router.use((err, req, res, next) => {
    if(err.status === 400) return res.status(err.status).json({status: 400, message: 'bad request'});
    return next(err);
});

router.all('/', (req, res) =>
    res.json({apiName: env.APINAME, apiVersion: env.APIVERSION, apiRoot: env.APIROOT, apiStatus: env.APISTATUS})
);

// Own Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/connection_activation', authController.connectionActivation);
router.post('/auth/resetpassword', authController.resetPassword);
router.post('/user/verifycode', userController.verifyCode);

///////////////////////////////////////////////////////////////////////////////////////////////////

// Authentication Routes
router.post('/auth/disconnect', authController.disconnect);
router.post('/auth/revokeconnections', authController.revokeConnections);

// Applications API
router.get('/app/fetch/:id', applicationController.fetch);
router.get('/app/connectionsource/:connection', applicationController.connectionsource);

// User Routes
router.get('/user/verify', userController.verify);
router.get('/user/fetch', userController.fetch);
router.post('/user/updatedetails', userController.updateMainDetails);
router.post('/user/update', userController.update);
router.post('/user/delete_properties', userController.deleteProperties);

// Data Routes
router.get('/statistics/cluster', statisticsController.cluster);
router.get('/statistics/application', statisticsController.application);
router.get('/statistics/clusterorderby', statisticsController.clusterOrderBy);
router.get('/statistics/getallusers', statisticsController.getAllUsers);


///////////////////////////////////////////////////////////////////////////////////////////////////
router.use(require('./specific'));
module.exports = router;

