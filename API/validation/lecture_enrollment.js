const Joi = require('joi');


const enrollment_validation ={
    enrollment_validation : async (req, res, next) =>{
        console.log("req  :", req.query);
        const body = req.query;

        const schema = Joi.object().keys({
          instructor_id: Joi.string().min(1).max(50).required(),
          class_name: Joi.string().min(1).max(20).required(),
          category: Joi.string().valid("web", "app", "database", "infra", "game", "algorithm"),
          price: Joi.string().min(1).max(20).required(),
          class_intro: Joi.string().min(1).max(20).required(),
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

module.exports = enrollment_validation;
