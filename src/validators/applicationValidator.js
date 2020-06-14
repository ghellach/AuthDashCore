const Joi = require('@hapi/joi');
const validationErrorParser = require('../functions/validationErrorParser');

const fetchValidator = (data) => {
    const verify = Joi.object({
        appId: Joi.string().required().max(255)
    });
    return validationErrorParser(verify.validate(data));
}

module.exports = {
    fetchValidator,
}