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

const verifyCodeValidator = (data) => {
    const verify = Joi.object({
        verificationCode: Joi.number().integer().required(),
        email: Joi.string().required(),
        use: Joi.string().required(),
        password: Joi.string()
    });
    return validationErrorParser(verify.validate(data));
}

const updateValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required(),
        appSecret: Joi.string().required(),
        token: Joi.string().required(),
        properties: Joi.object().required(),
    });
    return validationErrorParser(verify.validate(data));
}


const resetPasswordValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required(),
        appSecret: Joi.string().required(),
        token: Joi.string().required(),
        properties: Joi.array().required(),
    });
    return validationErrorParser(verify.validate(data));
}

const deletePropertiesValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required(),
        appSecret: Joi.string().required(),
        token: Joi.string().required(),
        properties: Joi.array().required(),
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    verifyValidator,
    verifyCodeValidator,
    updateValidator,
    deletePropertiesValidator
}