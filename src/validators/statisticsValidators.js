const Joi = require('@hapi/joi');
const validationErrorParser = require('../functions/validationErrorParser');

const clusterValidator = (data) => {
    const verify = Joi.object({
        clusterId: Joi.string().required(),
        clusterSecret: Joi.string().required(),
    });
    return validationErrorParser(verify.validate(data));
}

const applicationValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required(),
        appSecret: Joi.string().required(),
    });
    return validationErrorParser(verify.validate(data));
}

const clusterOrderByValidator = (data) => {
    const verify = Joi.object({
        clusterId: Joi.string().required(),
        clusterSecret: Joi.string().required(),
        property: Joi.string().required(),
        order: Joi.string().valid("desc", "asc").required()
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    clusterValidator,
    applicationValidator,
    clusterOrderByValidator
}