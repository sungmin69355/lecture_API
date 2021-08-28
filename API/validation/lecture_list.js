const Joi = require('joi');


const list_validation ={
    list_validation : async (req, res, next) =>{
        console.log("req  :", req.query);
        const body = req.query;
  
        const schema = Joi.object().keys({
          instructor_name: Joi.string().min(1).max(20),
          class_name: Joi.string().min(1).max(20),
          student_id: Joi.string().min(1).max(20),
          category: Joi.string().valid("web", "app", "database", "infra", "game", "algorithm", "all").required(),
          date_order_by: Joi.string().valid("1","0").required(),
        })
        .xor('class_name', 'instructor_name', 'student_id');
      
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

module.exports = list_validation;
