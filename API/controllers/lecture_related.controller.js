const mysql = require('../../config/database'),
      connection = mysql.init(),
      util = require('../../util.js');

mysql.connect(connection);

const lecture_related = {
    lecture_open:  async (req, res, next) =>{
        const body = req.query;

        try {
            return connection.query('SELECT * FROM class_table WHERE class_id =\''+ body.class_id+'\' AND class_open = false;', (err, class_result) => {
                console.log("class_table result: ", class_result);
                if(class_result.length ==0 ){
                    return res.json({code: 200, message : '이미 오픈된 강의거나 없는 강의 입니다.'});
                }
                return connection.query('UPDATE class_table SET class_open = true WHERE class_id =\''+class_result[0].class_id+'\';', () => {
                    res.json({code: 200, message : 'class open'});
                })
            })
        } catch (e) {
            return res.json({code: 400, e});
        }
    },

    lecture_delete: async (req, res, next)=>{
        const body = req.query;

        //강의가 있는지 여부판단
        try{
            return connection.query('SELECT * FROM class_table WHERE class_id =\'' + body.class_id + '\';', (err, class_result)=>{
                console.log("class_table result: ", class_result);
                if(class_result== [] || class_result.length == 0){
                    return res.json({code: 200, message : '등록된 강의가 없습니다.'});
                }
                 //수강여부를 확인
                return connection.query('SELECT * FROM apply_table WHERE class_id =\'' + body.class_id + '\';', (err, apply_result)=>{
                    console.log("apply_table result: ", apply_result);
                    //수강자가 없을 경우 바로 삭제
                    if(apply_result == [] || apply_result.length == 0){
                        return connection.query('DELETE FROM class_table WHERE class_id =\'' + body.class_id +'\';', ()=>{
                            return res.json({code: 200, message : 'class delete'});
                        })
                    }else{
                        return res.json({code: 200, message : '해당강의는 수강자가 있어 삭제할 수 없습니다.'});
                    }
                })
            })
        } catch (e){
            return res.json({code: 400, e});
        }
    },
    lecture_edit: async (req, res)=>{
        const body = req.query;

        try{
        // 강의 ID 확인
            return connection.query('SELECT * FROM class_table WHERE class_id =\'' + body.class_id + '\';', (err, result)=>{
                console.log("req  :",req.query);
                const time = util.new_Date();
                console.log('now time : ', time);
                if(result.length == 0 || result == undefined){
                    return res.json({code: 200, message : "강의 ID를 찾을 수 없습니다. 다시입력해주세요"});
                }
                let query_value = [body.class_name, body.class_intro, Number(body.class_price), time, body.class_id ];
                console.log(query_value);
                return connection.query('UPDATE class_table SET class_name=?, class_intro=?, price=?, class_update_date=? WHERE class_id=?;', query_value, ()=>{
                    connection.query('UPDATE apply_table SET class_name=? WHERE class_id=?; ',[body.class_name,body.class_id]);
                    return res.json({code: 200, message : "강의 정보를 수정하였습니다."});
                })
            })
        } catch(e){
            return res.json({code: 400, e});
        }
    },
    
    lecture_details :  async (req, res) =>{
        const body = req.query;

        const class_find_query = 'SELECT class_table.*, instructor_table.instructor_name ,(SELECT count(*) FROM apply_table WHERE class_table.class_id = apply_table.class_id) AS members FROM class_table, instructor_table WHERE class_table.instructor_id = instructor_table.instructor_id AND class_table.class_id = \''+ body.class_id + '\';';
        const student_find_query = 'SELECT GROUP_CONCAT("{ ", student_name, " : ", date_format(apply_date, "\'%Y-%m-%d\'"), " }") AS student FROM apply_table WHERE apply_table.class_id = \'' + body.class_id + '\';';
        //비공개이여도 상세조회 가능
        try{
            return connection.query(class_find_query, (error, class_find) =>{
                console.log(class_find);
                if(class_find.length == 0){
                    return res.json({message : "아이디를 잘못 입력 하셨습니다."});
                }
                return connection.query(student_find_query, (error, student_find) =>{
                    console.log(student_find);
                    class_find[0].student = student_find[0].student;
                    console.log(class_find);
                    return res.json({code : 200, class_find});

                })
            });
        } catch(e){
            return res.json(e); 
        }
}

}

module.exports = lecture_related;
