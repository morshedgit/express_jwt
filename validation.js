
const Joi = require("joi");

const registerValidation = (data)=>{

    //Validation schema
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);

}
const loginValidation = (data)=>{

    //Validation schema
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);

}
const postValidation = (data)=>{

    //Validation schema
    const schema = Joi.object({
        title: Joi.string().min(6).required(),
        content: Joi.string().min(10).required(),
    });

    return schema.validate(data);

}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;