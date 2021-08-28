const mysql = require('../../config/database'),
      connection = mysql.init(),
      util = require('../../util.js');

mysql.connect(connection);

const lecture_list = {
  lecture_list : async (req, res, next) =>{
      const body = req.query;
      let queryarr = [];

      const class_find_query = 'SELECT class_table.*, instructor_table.instructor_name ,(SELECT count(*) FROM apply_table WHERE class_table.class_id = apply_table.class_id) AS members FROM class_table, instructor_table WHERE class_table.instructor_id = instructor_table.instructor_id AND class_table.class_open = 1;';
      try{
        if(body.instructor_name){
          return connection.query(class_find_query, (error, class_result) =>{
            console.log("class_result : ", class_result);
            if(body.category == 'all'){ //모든 카테고리
              for(let i =0;i<class_result.length;i++){
                if(class_result[i].instructor_name == body.instructor_name){
                  queryarr.push(class_result[i]);
                }
              }
            }else{ //그 외 모든 카테고리
              for(let i =0;i<result.length;i++){
                if(result[i].instructor_name == body.instructor_name && result[i].category == body.category){
                  queryarr.push(result[i]);
                }
              }
            }
            util.date_order_by(body.date_order_by, queryarr);
  
            return res.json({code :200, queryarr});
          })
        }else if(body.student_id){
          const student_id_find_query = 'SELECT class_table.*,instructor_table.instructor_name, (SELECT count(*) FROM apply_table WHERE class_table.class_id = apply_table.class_id) AS members FROM apply_table, class_table, instructor_table WHERE apply_table.student_id =\'' + body.student_id + '\' AND class_table.instructor_id = instructor_table.instructor_id AND apply_table.class_id = class_table.class_id AND class_table.class_open =1;';
          return connection.query(student_id_find_query, (error, result) =>{
            console.log(result);
            if(body.category == 'all'){ //모든 카테고리
              for(let i =0;i<result.length;i++){
                  queryarr.push(result[i]);
              }
            }else{ //그 외 모든 카테고리
              for(let i =0;i<result.length;i++){
                if(result[i].category == body.category){
                  queryarr.push(result[i]);
                }
              }
            }
            util.date_order_by(body.date_order_by, queryarr);
            return  res.json({code :200, queryarr});
          })
        }else if(body.class_name){
            return connection.query(class_find_query, (error, class_result) =>{
              console.log("class_result : ", class_result);
            if(body.category == 'all'){ //모든 카테고리
              for(let i =0;i<class_result.length;i++){
                if(class_result[i].class_name == body.class_name){
                  queryarr.push(class_result[i]);
                }
              }
            }else{// 그외 카테고리
              for(let i =0;i<class_result.length;i++){
                if(class_result[i].class_name == body.class_name && class_result[i].category == body.category){
                  queryarr.push(class_result[i]);
                }
              }
            }
            util.date_order_by(body.date_order_by, queryarr);
            return  res.json({code :200, queryarr});
          })
        }else{
          return res.json({code :204, message: "해당 강의가 없습니다."});
        }
      }catch(e){
        return res.json(e);
      }
    }
}

module.exports = lecture_list;