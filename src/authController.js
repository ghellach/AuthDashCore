// Models
const User = require('./models/User');
const Application = require('./models/Application');
const Connection = require('./models/Connection');
const Cluster = require('./models/Cluster');
// Validators and parsers
const {verifyToken} = require('./userController');
const authValidators = require('./validators/authValidators');
const userValidator = require('./validators/userValidator');
const errorParser = require('./data/errors');
// third-party modulecodes
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const random = require("randomstring");
// own
const {emailConfimation} = require('./gateways/emailGateway');


//////////////////////////////////////////////////////////////////////////

const register = async (req, res) => {
    // proceeds to bdy validation
    const {error} = authValidators.registerValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // fetch the application
    const application = await Application.findOne({appId: req.body.appId});
    if(!application) return errorParser(res, 1000);

    // fetch the app's cluster
    const cluster = await Cluster.findOne({_id: application.clusterId})
    if(!cluster) return errorParser(res, 1000);
    
    // checks if email already used;
    const userCheck = await User.findOne({email: req.body.email});
    if(userCheck) return errorParser(res, 8000);

    // hashes password
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);

    // new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: password,
        clusterId: application.clusterId,
        lastIp: req.connection.remoteAddress,
        lang: req.body.lang
    });
    
    // send email confirmation, saves user, and sends response
    emailConfimation(res, user, cluster, errorParser);

}

const login = async (req, res) => {
    // validate body
    const {error} = authValidators.loginValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // fetch the application
    const application = await Application.findOne({appId: req.body.appId});
    if(!application) return errorParser(res, 1000);

    // fetch user
    const user = await User.findOne({email: req.body.email});
    if(!user) return errorParser(res, 7001);

    // activity checks
    if(user.active === 9) return errorParser(res, 7021);
    if(user.active === 8) return errorParser(res, 7023);
    if(user.active !== 1) return errorParser(res, 7024);

    // check password
    const decrypt = bcrypt.compareSync(req.body.password, user.password);
    if(!decrypt) return errorParser(res, 7002);

    // generate JWT
    let minutes = application.accessMinutes;
    const token = jwt.sign({
        userId: user.userId,
        exp: moment().add(minutes,'minutes').unix()
    }, process.env.JWTSECRET);

    // generate connection
    const connection = new Connection({
        userId: user._id,
        appId: application._id,
        access_token: token,
        refresh_token: random.generate(256),
        minutes: minutes
    });
    connection.save();

    //set last connection ip and date
    user.lastIp = req.connection.remoteAddress;
    user.lastConnectionAt = Date.now();
    user.lastConnections.push({ip: user.lastIp, at: user.lastConnectionAt});
    await user.save();

    // return connectionId
    return res.json({
        message: 'connection created successfully',
        connectionId: connection.connectionId
    });

}

const connectionActivation = async (req, res) => {
    const {error} = authValidators.connectionActivationValidator(req.body);
    if (error) return errorParser(res, "validation", error);

    // TODO add date validation
    // verifies JWT
    let token;
    try{
        token = jwt.verify(req.body.token, process.env.CLIENTTOKEN);
    }catch{
        return errorParser(res, 2000);
    }

    // fetches connection
    const connection = await Connection.findOne({connectionId: token.connectionId, activated: false});
    if(!connection) return errorParser(res, 2000);
    connection.activated = true
    connection.save();

    // return JWT to be stored as cookie
    res.json({
        access_token: connection.access_token
    });
}

const resetPassword = async (req, res) => {
    
}

const disconnect = async(req, res) => {
    const {error} = userValidator.verifyValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    const connection = await verifyToken(req, res);

    connection.revoked = true;
    await connection.save();

    return res.json({
        status: 200,
        message: "token revoked successfully"
    })
    
}

const revokeConnections = async(req, res) => {
    const {error} = userValidator.verifyValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    const connection = await verifyToken(req, res);

    const user = connection.userId;

    const connections = await Connection.find({userId: user.id, revoked: false});

    connections.forEach(async connection => {
        connection.revoked = true;
        await connection.save();
    })

    return res.json({
        status: 200,
        message: "all tokens revoked successfully",
        totalRevoked: connections.length
    })
    
}

module.exports = {
    register,
    login,
    connectionActivation,
    disconnect,
    revokeConnections
}