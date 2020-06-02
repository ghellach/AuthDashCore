const Joi = require('@hapi/joi');
const validationErrorParser = require('../functions/validationErrorParser');

const verifyValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required(),
        appSecret: Joi.string().required(),
        token: Joi.string().required()
    });
    return validationErrorParser(verify.validate(data));
}

const modifyValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required(),
        appSecret: Joi.string().required(),
        token: Joi.string().required(),
        properties: Joi.object().required(),
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    verifyValidator,
    modifyValidator
}