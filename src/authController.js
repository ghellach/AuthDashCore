// Models
const User = require('./models/User');
const Application = require('./models/Application');
const Connection = require('./models/Connection');
// Validators and parsers
const authValidators = require('./validators/authValidators');
const errorParser = require('./data/errors');
// third-party modulecodes
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const random = require("randomstring");


//////////////////////////////////////////////////////////////////////////

const register = async (req, res) => {
    // proceeds to bdy validation
    const {error} = authValidators.registerValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // fetch the application
    const application = await Application.findOne({appId: req.body.appId});
    if(!application) return errorParser(res, 1000);

    // checks if email already used;
    const userCheck = await User.findOne({email: req.body.email});
    if(userCheck) return errorParser(res, 8000);

    // hashes password
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    console.log(application);
    // new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        email: req.body.email,
        password: password,
        clusterId: application.clusterId
    });
    user.save();

    return res.json({
        status: 200,
        message: 'user with email '+user.email+' has been created successfully !'
    });
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
        accessToken: token,
        refreshToken: random.generate(256),
        minutes: minutes
    });
    connection.save();

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
        token = jwt.verify(req.body.token, process.env.TOKEN);
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
        accessToken: connection.accessToken
    });
}

module.exports = {
    register,
    login,
    connectionActivation
}