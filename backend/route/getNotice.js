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

app.get('/'  , (req , res) => {
    let sql = "select * from notice";
    sqlConfig.query(sql , function(err, rows, fields) {
        if (err) {
            console.log('[query] - :' + err);
            return;
        }
        res.send({
            code:0,
            data:rows,
            msg:'查询公告成功'
        })
    });
});

module.exports = app