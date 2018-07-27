const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');

app.post('/' , (req , res) => {
    changeRate.getMoneyRate(1).then((result) => {
        res.send({
            rate:parseFloat(result),
            code:1,
            msg:'获取汇率成功'
        })
    })
});

module.exports = app