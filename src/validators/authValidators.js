const Joi = require('@hapi/joi');
const validationErrorParser = require('../functions/validationErrorParser');

const registerValidator = (data) => {
    const verify = Joi.object({
        firstName: Joi.string().required().max(255),
        lastName: Joi.string().required().max(255),
        country: Joi.string().required().length(2),
        email: Joi.string().max(25).required().email(),
        password: Joi.string().min(6).required(),
        appId: Joi.string().required()
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    registerValidator
}