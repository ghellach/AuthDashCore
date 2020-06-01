const Connection = require('./models/Connection');
// Validators and error parsers
const userValidator = require('./validators/userValidator');
const errorParser = require('./data/errors');
// third-party modules
const jwt = require('jsonwebtoken');

const verify = async (req, res) => {
    const {error} = userValidator.verifyValidator(req.body);
    if(error) return errorParser(res, "validation", error);

    // validates JWT
    try {
        let validation = jwt.verify(req.body.token, process.env.JWTSECRET);
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

    // return success message with user id
    return res.json({
        message: 'token is valid',
        userId: connection.userId.userId
    });


}

module.exports = {
    verify
}