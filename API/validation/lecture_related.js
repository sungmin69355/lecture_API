const Joi = require('joi');


const lecture_related_validation ={
    lecture_open : async (req, res, next) =>{
        console.log("req  :",req.query);
        const body = req.query;
        const schema = Joi.object().keys({
            class_id: Joi.string().min(1).max(20).required(),
        });

        try {
            //body 유효성 검사
            await schema.validateAsync(body);   
        } catch (e) {
            // 유효성 검사 에러
            return res.status(400).json({ code: 400, message: e.message })
        }
        next();
    },
    lecture_delete : async (req, res, next) =>{
        console.log("req  :",req.query);
        const body = req.query;
        const schema = Joi.object().keys({
            class_id: Joi.string().min(1).max(20).required(),
        });

        try {
            //body 유효성 검사
            await schema.validateAsync(body);   
        } catch (e) {
            // 유효성 검사 에러
            return res.status(400).json({ code: 400, message: e.message })
        }
        next();
    },
    lecture_edit : async (req, res, next) =>{
        console.log("req  :",req.query);
        const body = req.query;
        const schema = Joi.object().keys({
            class_id: Joi.string().min(1).max(20).required(),
            class_name: Joi.string().min(1).max(20).required(),
            class_intro: Joi.string().min(1).max(500).required(),
            class_price: Joi.number().min(1).required()
        })

        try {
            //body 유효성 검사
            await schema.validateAsync(body);   
        } catch (e) {
            // 유효성 검사 에러
            return res.status(400).json({ code: 400, message: e.message })
        }
        next();
    },
    lecture_details : async (req, res, next) =>{
        console.log("req  :",req.query);
        const body = req.query;
        const schema = Joi.object().keys({
            class_id: Joi.string().min(1).max(20).required(),
        });
        
        try {
            // 검사시작
            await schema.validateAsync(body);   
        } catch (e) {
            // 유효성 검사 에러
            return res.status(400).json({ code: 400, message: e.message })
        }
        next();
    },

};

module.exports = lecture_related_validation;
