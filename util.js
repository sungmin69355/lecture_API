const moment = require('moment');

exports.id_create = () => {
    let length = 20;
    let chatset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    let text = "";
    for (let i = 0; i < length; i++) {
        text += chatset.charAt(Math.floor(Math.random() * chatset.length));
    }
    return text;
  }
  
exports.new_Date = () => {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    return time;
}

exports.date_order_by = (order, array) =>{
    if(order == "0"){ //내림차순
        array = array.sort((a, b) => {
          return new Date(a.class_create_date) - new Date(b.class_create_date);
        });
      }else{ //오름차순
        array = array.sort((a, b) => {
          return new Date(b.class_create_date) - new Date(a.class_create_date);
        });
      }
}