const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/egs/js/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');
let exchangeRateMethods = require('../util/exchangeRate');

app.post('/' , (req , res) => {
    if(req.body.type == 'usd'){
        let bx_sex = req.body.sex , bx_age = req.body.calYears , bx_nian = req.body.giveMoneyYear , bx_smoke = req.body.smoke , bx_bf = req.body.bf ;
        let bx_be = tool.CHK_be(bx_nian,bx_bf)

        exchangeRateMethods.getMoneyRate(1).then((result) => {
            let returnObj = {
                code:1,
                data:{
                    be:bx_be,
                    insurance_money:bx_bf,
                    changeBaofei:bx_bf * parseFloat(result),
                    changeBaoe:bx_be * parseFloat(result)
                }
            }
            res.send(returnObj)
        })
    }

    if(req.body.type == 'rmb'){
        let bx_sex = req.body.sex , bx_age = req.body.calYears , bx_nian = req.body.giveMoneyYear , bx_smoke = req.body.smoke , bf = req.body.bf ;

        exchangeRateMethods.getMoneyRate(1).then((result) => {
            //人民币保费转换成保额
            let bx_bf = Math.round(parseFloat(bf / parseFloat(result)));
            let bx_be = tool.CHK_be(bx_nian,bx_bf)

            let returnObj = {
                code:1,
                data:{
                    be:bx_be,
                    insurance_money:bx_bf,
                    changeBaofei:bf,
                    changeBaoe:(bx_be * parseFloat(result)).toFixed(2)
                }
            }
            res.send(returnObj)
        })
    }
})

module.exports = app