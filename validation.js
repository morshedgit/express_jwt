
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

    try{

        //Validation schema
        const schema = Joi.object({
            title: Joi.string().min(6).required(),
            content: Joi.string().min(10).required(),
            author:Joi.string().required(),
            tags:Joi.array().items(Joi.string().min(5).max(30))
        });
    
        return schema.validate(data);

    }catch(e){
        return new Error(e)
    }

}
const commentValidation = (data)=>{

    try{
        //Validation schema
        const schema = Joi.object({
            text: Joi.string().min(6).required(),
            post:Joi.required(),
            author:Joi.optional(),
        });    
        return schema.validate(data);

    }catch(e){
        return new Error(e)
    }

}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.commentValidation = commentValidation;