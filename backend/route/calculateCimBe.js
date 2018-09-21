const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/cim/js/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');
let exchangeRateMethods = require('../util/exchangeRate');

app.post('/' , (req , res) => {
    let bx_area=req.body.living , bx_sex = req.body.sex , bx_age = req.body.calYears , bx_nian = req.body.giveMoneyYear , bx_smoke = req.body.smoke , bx_bf = req.body.bf , type = req.body.type ;

    if(req.body.type == 'usd'){

        let calBe = tool.dis_be(bx_area,bx_sex,bx_age,bx_nian,bx_smoke,bx_bf)

        exchangeRateMethods.getMoneyRate(1).then((result) => {
            let returnObj = {
                code:1,
                data:{
                    be:calBe,
                    insurance_money:bx_bf,
                    changeBaofei:bx_bf * parseFloat(result),
                    changeBaoe:calBe * parseFloat(result)
                }
            }
            res.send(returnObj)
        })
    }

    if(req.body.type == 'rmb'){
        let sex = req.body.sex , age = req.body.calYears , insuranceYears = req.body.giveMoneyYear , isSmoke = req.body.smoke , bf = req.body.bf ;

        exchangeRateMethods.getMoneyRate(1).then((result) => {
            //人民币保费转换成保额
            let changeBf = parseFloat(parseFloat(bf / parseFloat(result))).toFixed(2);
            let calBe = tool.dis_be(bx_area,bx_sex,bx_age,bx_nian,bx_smoke,changeBf)

            let returnObj = {
                code:1,
                data:{
                    be:calBe,
                    insurance_money:changeBf,
                    changeBaofei:changeBf * parseFloat(result).toFixed(2),
                    changeBaoe:calBe * parseFloat(result)
                }
            }
            res.send(returnObj)
        })
    }
})

module.exports = app