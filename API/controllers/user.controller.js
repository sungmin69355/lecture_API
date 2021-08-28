const mysql = require('../../config/database'),
      connection = mysql.init(),
      util = require('../../util.js');

mysql.connect(connection);

const user = {
    signup : async (req, res, next) =>{
        const body = req.query;

        try{
          let id = util.id_create();
          return connection.query('SELECT email FROM student_table WHERE email = ?;',body.email, (error, userMail)=>{
              if(userMail.length == 0){
                return connection.query('insert into student_table (student_id, student_name, email) values (?, ?, ?);', [
                  id,
                  body.name,
                  body.email,
                ], () => {
                  console.log("create user");
                  return res.status(200).json({code: 200, message : 'create user'});
                })
              }else{
                console.log("이미 가입한 계정입니다.");
                return res.json({code: 204, message : '이미 가입한 계정입니다.'});
              }
           })
        }catch(e){
          return res.json(e);
        }
    }
}

module.exports = user;