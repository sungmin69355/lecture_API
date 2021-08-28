const Joi = require('joi');


const user_validation ={
    user_singup : async (req, res, next) =>{
        console.log("req  :", req.query);
        const body = req.query;

        const schema = Joi.object().keys({
          name: Joi.string().min(1).max(20).required(),
          email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        });

        try {
          // 검사시작
          await schema.validateAsync(body);   
        } catch (e) {
          // 유효성 검사 에러
          return res.status(400).json({ code: 400, message: e.message })
        }
        next();
    }
};

module.exports = user_validation;
