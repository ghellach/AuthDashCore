const Connection = require('./models/Connection');
const User = require('./models/User');
const ConfirmationCode = require('./models/ConfirmationCode');
// Validators and error parsers
const userValidator = require('./validators/userValidator');
const errorParser = require('./data/errors');
// third-party modules
const jwt = require('jsonwebtoken');

///////////////////////////////////////////////////////////////////////////////////////
const verifyToken = async(req, res) => {
    // validates JWT
    try {
        jwt.verify(req.body.token, process.env.JWTSECRET);
    }catch{
        return errorParser(res, 7010);
    }

    // fetches connection
    const connection = await Connection
        .findOne({access_token: req.body.token, activated: true, revoked: false})
        .populate('appId')
        .populate('userId');
    if(!connection) return errorParser(res, 7010);
    if(connection.appId.appId !== req.body.appId) return errorParser(res, 1000);
    if(connection.appId.appSecret !== req.body.appSecret) return errorParser(res, 1001);

    return connection;
}
///////////////////////////////////////////////////////////////////////////////////////


const verify = async (req, res) => {
    const {error} = userValidator.verifyValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    const connection = await verifyToken(req, res);

    // return success message with user id
    return res.json({
        message: 'token is valid',
        userId: connection.userId.userId
    });
}

const verifyCode = async (req, res) => {
    const {error} = userValidator.verifyCodeValidator(req.body);
    if(error) return errorParser(res, "validation", error);

     // fetch user
     const user = await User.findOne({email: req.body.email});
     if(!user) return errorParser(res, 2001);

    // fetch code
    const code = await ConfirmationCode.findOne({code: req.body.verificationCode, use:req.body.use, user: user._id, used: false});
    if(!code) return errorParser(res, 2001);

    // see if expired
    if(code.expiresAt < Date.now()) return errorParser(res, 2001);

    // see if code matches email
    if(user.email !== req.body.email) return errorParser(res, 2001);

    // set email or phone as verified
    let what = '';
    if(req.body.use === "emailConfirmation") {
        user.emailVerifiedAt = Date.now();
        what = 'email';
    }else if(req.body.use === "phoneConfirmation"){
        user.phoneVerifiedAt = Date.now();
        what = 'phone';
    }

    // set code as used and user as verified
    code.used = true
    await code.save();
    user.active = 1;
    await user.save();

    return res.json({
        status: 200,
        message: what + " emailverified successfully"
    });

    
}

const fetch = async (req, res) => {
    const {error} = userValidator.verifyValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    const connection = await verifyToken(req, res);

    // format response
    const user = connection.userId;

    // format properties and remove null ones
    let properties = Array();
    properties = user.properties;
    Object.keys(properties).forEach(field => {
        if (properties[field] == null) {
            properties[field] = undefined;
        } else {
            properties[field] = properties[field];
        }
    });

    // return success message with user id
    return res.json({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
        phone: user.phone,
        phoneVerifiedAt: user.phoneVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastIp: user.lastIp,
        lastConnectionAt: user.lastConnectionAt,
        properties: properties,
    });
}

const update = async (req, res) => {
    const {error} = userValidator.updateValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // defines connection and properties from user that is pre-fetched by middleware right below
    const connection = await verifyToken(req, res);
    const properties = connection.userId.properties;

    let addedProperties = [];
    let modifiedProperties = [];

    // modifies fields or adds new if non existant
    Object.keys(req.body.properties).forEach(field => {
        const before = properties[field];
        if(before === undefined || before === null) {
            addedProperties.push(field);
        }else if(before !== req.body.properties[field]) {
            modifiedProperties.push(field);
            properties[field] = undefined;
            properties[field] = req.body.properties[field];
        }
    });

    // modify user object
    const user = await User.findOneAndUpdate({_id: connection.userId._id}, {
        $set:  {
            properties: properties
        }
    });

    // change update date
    user.updatedAt = Date.now();
    await user.save();

    res.json({
        message: "user properties modified successfully",
        userId: user.userId,
        addedProperties,
        modifiedProperties
    });
}

const deleteProperties = async(req, res) => {
    const {error} = userValidator.deletePropertiesValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // defines connection and properties from user that is prefetched by middleware right below
    const connection = await verifyToken(req, res);
    let properties = [];
    properties = connection.userId.properties;

    // modifies fields or adds new if non existant
    req.body.properties.forEach(field => {
        properties[field] = undefined
    });

    await User.updateOne({_id: connection.userId._id}, {
        $set: {
            properties: properties
        }
    });

    // change update date
    user.updatedAt = Date.now();
    await user.save();

    // set user object
    res.json({
        message: "user properties modified successfully",
        properties_deleted: req.body.properties,
        userId: connection.userId.userId
    });

}

module.exports = {
    verifyToken,
    verify,
    verifyCode,
    fetch,
    update,
    deleteProperties
}