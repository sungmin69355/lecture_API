const mysql = require('../../config/database'),
      connection = mysql.init(),
      util = require('../../util.js');

mysql.connect(connection);

const enrollment = {
    lecture_enrollment:  async (req, res, next) =>{
        const body = req.query;
        const class_id = util.id_create();

        //강사아이디 확인
        return connection.query('SELECT instructor_id FROM instructor_table WHERE instructor_id = ?;', body.instructor_id, (error, instructor_result)=>{
          console.log('instructor_id query result : '. instructor_result);
          if(!(instructor_result.length ==0)){
            //중복 강의 명 체크 
            return connection.query('SELECT class_name FROM class_table WHERE class_name =?;', body.class_name, (error, class_result)=>{
              console.log("class : ", class_result);
              if(!(class_result.length == 0)){
                return res.json({ code: 200, message : '이미 개설된 강의 입니다.'});
              }else{
                return connection.query('insert into class_table (class_id, class_name, category, price, class_intro, class_create_date, instructor_id, class_open) values (?, ?, ?, ?, ?, ?, ?, ?);',[
                  class_id,
                  body.class_name,
                  body.category,
                  body.price,
                  body.class_intro,
                  util.new_Date(),
                  body.instructor_id,
                  false, //강의생성시 비공개로 생성
                  ], () =>{
                    console.log('enrollment success');
                    return res.json({code: 200, message : 'enrollment success'});
                  })
              }
            })
          }else{
            return res.json({ code: 200, message : '강사 아이디를 다시 확인해주세요.'});
          }
        });
    }
};

module.exports = enrollment;