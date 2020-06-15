const Joi = require('@hapi/joi');
const validationErrorParser = require('../functions/validationErrorParser');

const registerValidator = (data) => {
    const verify = Joi.object({
        firstName: Joi.string().required().max(255),
        lastName: Joi.string().required().max(255),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).required(),
        appId: Joi.string().required(),
        lang: Joi.string().length(2).required()
    });
    return validationErrorParser(verify.validate(data));
}

const loginValidator = data => {
    const verify = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        appId: Joi.string().required()
    });
    return validationErrorParser(verify.validate(data));
}

const connectionActivationValidator = data => {
    const verify = Joi.object({
        token: Joi.string().required()
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    registerValidator,
    loginValidator,
    connectionActivationValidator
}