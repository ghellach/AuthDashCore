const Joi = require('@hapi/joi');
const validationErrorParser = require('../functions/validationErrorParser');

const verifyValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required(),
        token: Joi.string().required()
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    verifyValidator
}