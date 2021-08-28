const mysql = require('../../config/database'),
      connection = mysql.init(),
      util = require('../../util.js');

mysql.connect(connection);

const apply = {
    lecture_apply:  async (req, res, next) =>{
        const body = req.query;

        try{
            ///비동기적으로 강의 ID와 학생ID를 가져와 값이 있는지 확인해야한다. promise로 쿼리를 비동기로 받아왔는데 결과값이 아닌 정보가 날라온다(해결해보자) 효율성이 너무 안좋다.... promise로 다시 묶어야겠다.
            return connection.query('SELECT * FROM student_table WHERE student_id = \"'+ body.student_id+'\"', (err, student_result) =>{
                console.log("student :", student_result);
                if(student_result == null || student_result.length == 0){
                    return res.json({code: 204, message : '학생 정보가 없습니다.'});
                }else{
                    return connection.query('SELECT * FROM class_table WHERE class_id = \"'+ body.class_id +'\" AND class_open = true;', (err, class_result) => {
                    console.log("class : ", class_result);
                    if(class_result == null || class_result.length == 0){
                        return res.json({code: 204, message : '오픈된 강의가 없습니다.'});
                    }//수강신청을 했는지 여부를 확인
                    return connection.query('SELECT * FROM apply_table WHERE class_id = \"' + class_result[0].class_id + '\"  AND student_id =\"'+student_result[0].student_id+'\";', (err, apply_result)=>{
                        console.log(apply_result);
                        //해당 강좌를 수강신청안했다면 수강신청해주기
                        const apply_id = util.id_create();
                        if(apply_result.length == 0 || apply_result == []){
                        return connection.query('insert into apply_table (apply_id, class_id, class_name, student_id, student_name, email, apply_date) values (?, ?, ?, ?, ?, ?, ?);', [
                            apply_id,
                            class_result[0].class_id,
                            class_result[0].class_name,
                            student_result[0].student_id,
                            student_result[0].student_name,
                            student_result[0].email,
                            util.new_Date()
                            ], () =>{
                            console.log('class apply success');              
                            res.json({code: 200, message : 'apply success'});
                            })
                        }else{
                        //이미 수강신청을 했을경우
                            return res.json({code: 204, message : '이미 수강 신청한 강의입니다.'});
                            }
                        })
                    })
                }
            })
        } catch (e){
            return res.json(e);
        }
    }
}

module.exports = apply;