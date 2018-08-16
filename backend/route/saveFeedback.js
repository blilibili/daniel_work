const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');
let multer  = require('multer');
let sqlConfig = require('../util/sqlConfig');

function forMatTime(inputTime , methods){
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    switch (methods){
        case 'day':
            return y + '-' + m + '-' + d;
            break;
        case 'seconds':
            return y + '-' + m + '-' + d + ' ' + h + ':' +minute + ':' + second;
            break;
        default:
            return '参数错误请检查';
            break;
    }
}

app.post('/'  , (req , res) => {
    let feedBackContent = req.body.feedBackContent , uploadImgSrc = req.body.uploadImgSrc , type = req.body.type , email = req.body.email , tel = req.body.tel , wxCode = req.body.wxCode , proId = req.body.proId;
    console.log(tel);
    let tmp = [type , feedBackContent , uploadImgSrc ,forMatTime(new Date().getTime() , 'day') , email , tel , wxCode , proId];
    let sql = "insert into feedback (type , content , upload_src , time , email , tel , wx_code , proId) values(? , ? , ? , ? , ? , ? , ? , ?)";
    sqlConfig.query(sql , tmp, function(err, rows, fields) {
        if (err) {
            console.log('[query] - :' + err);
            return;
        }
        res.send({
            code:0,
            msg:'提交成功'
        })
    });
});

module.exports = app