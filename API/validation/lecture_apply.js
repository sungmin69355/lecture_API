const Joi = require('joi');


const apply_validation ={
    apply_validation : async (req, res, next) =>{
        console.log("req  :", req.query);
        const body = req.query;

        const schema = Joi.object().keys({
            class_id: Joi.string().min(1).max(20).required(),
            student_id: Joi.string().min(1).max(20).required(),
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

module.exports = apply_validation;
