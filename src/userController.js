const Connection = require('./models/Connection');
const User = require('./models/User');
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
        .findOne({accessToken: req.body.token, activated: true, revoked: false})
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
        country: user.country,
        properties: properties
    });
}

const update = async (req, res) => {
    const {error} = userValidator.updateValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // defines connection and properties from user that is pre-fetched by middleware right below
    const connection = await verifyToken(req, res);
    const properties = connection.userId.properties;

    // modified and added count
    let modified = [];
    let added = [];

    // modifies fields or adds new if non existant
    Object.keys(req.body.properties).forEach(field => {
        const before = properties[field];
        console.log(before);
        if(before === undefined){
            added.push(properties[field]);
        }
        else {
            if (before !== null) {
                if(properties[field] !== req.body.properties[field]) {
                    modified.push(properties[field]);
                }
                properties[field] = undefined;
                properties[field] = req.body.properties[field];
            }
        }

    });

    // modify user object
    const user = await User.findOneAndUpdate({_id: connection.userId._id}, {
        $set:  {
            properties: properties
        }
    });

    res.json({
        message: "user properties modified successfully",
        userId: user.userId,
        propertiesAdded: modified,
        propertiesModified: added
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
    // set user object
    res.json({
        message: "user properties modified successfully",
        properties_deleted: req.body.properties,
        userId: connection.userId.userId
    });

}

module.exports = {
    verify,
    fetch,
    update,
    deleteProperties
}