const router = require('express').Router();
const authController = require('../authController');

const env = process.env;
router.all('/', (req, res) =>
    res.json({apiName: env.APINAME, apiVersion: env.APIVERSION, apiRoot: env.APIROOT, apiStatus: env.APISTATUS})
);
router.post('/auth/register', authController.register);


router.use(require('./specific'));
module.exports = router;

