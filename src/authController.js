// Models
const User = require('./models/User');
const Application = require('./models/Application');
// Validators and parsers
const authValidators = require('./validators/authValidators');
const errorParser = require('./data/errors');
// third-party modules
const bcrypt = require('bcryptjs');


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

module.exports = {
    register
}