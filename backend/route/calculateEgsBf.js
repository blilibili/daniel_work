const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/egs/js/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');
let exchangeRateMethods = require('../util/exchangeRate');

app.post('/' , (req , res) => {
    let bx_sex = req.body.sex , bx_age = req.body.calYears , bx_nian = req.body.giveMoneyYear , bx_smoke = req.body.smoke , bx_be = req.body.be , type = req.body.type ;

    var bfl = tool.chk_bfl(parseInt(bx_nian),bx_be);

    if(type == 'usd') {
        exchangeRateMethods.getMoneyRate(1).then((result) => {
            //汇率转换
            let returnObj = {
                code:1,
                data:{
                    changeBe:(parseFloat(bx_be) * result).toFixed(2),
                    guranteed:Math.round(bfl),
                    changeBaofei:bfl * parseFloat(result)
                }
            }
            res.send(returnObj)
        })
    }
    if(type == 'rmb'){
        exchangeRateMethods.getMoneyRate(1).then((result) => {
            let intBaoe = parseFloat(bx_be / parseFloat(result)).toFixed(2);
            //汇率转换保额
            let intBaofei = tool.chk_bfl(parseInt(bx_nian) , intBaoe);

            //汇率转换
            let returnObj = {
                code:1,
                data:{
                    changeBe:intBaoe,
                    guranteed:Math.round(intBaofei),
                    changeBaofei:Math.round(intBaofei * result)
                }
            }
            res.send(returnObj)

        })
    }
})

module.exports = app