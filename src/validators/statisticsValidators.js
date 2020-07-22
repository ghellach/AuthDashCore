const Joi = require('@hapi/joi');
const validationErrorParser = require('../functions/validationErrorParser');

const clusterValidator = (data) => {
    const verify = Joi.object({
        clusterId: Joi.string().required(),
        clusterSecret: Joi.string().required(),
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    clusterValidator,
}