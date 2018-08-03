const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/cir2/js/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');
let exchangeRateMethods = require('../util/exchangeRate');

app.post('/' , (req , res) => {
    if(req.body.type == 'usd'){
        let bx_sex = req.body.sex , bx_age = req.body.calYears , bx_nian = req.body.giveMoneyYear , bx_smoke = req.body.smoke , bx_bf = req.body.bf ;
        let calCirBaoe = tool.dis_be(bx_sex,bx_age,bx_nian,bx_smoke,bx_bf).toFixed(2);

        exchangeRateMethods.getMoneyRate(1).then((result) => {
            let returnObj = {
                code:1,
                data:{
                    be:calCirBaoe,
                    insurance_money:bx_bf,
                    changeBaofei:bx_bf * parseFloat(result),
                    changeBaoe:calCirBaoe * parseFloat(result)
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
            let calCirBaoe = tool.dis_be(bx_sex,bx_age,bx_nian,bx_smoke,bx_bf).toFixed(2);

            let returnObj = {
                code:1,
                data:{
                    be:calCirBaoe,
                    insurance_money:bx_bf,
                    changeBaofei:bx_bf * parseFloat(result),
                    changeBaoe:calCirBaoe * parseFloat(result)
                }
            }
            res.send(returnObj)
        })
    }
})

module.exports = app