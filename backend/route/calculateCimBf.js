const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/cim/js/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');
let exchangeRateMethods = require('../util/exchangeRate');

app.post('/' , (req , res) => {
    let bx_area=req.body.living , bx_sex = req.body.sex , bx_age = req.body.calYears , bx_nian = req.body.giveMoneyYear , bx_smoke = req.body.smoke , bx_be = req.body.be , type = req.body.type ;

    let bfl = tool.chk_bfl(bx_area,bx_sex,bx_smoke,bx_nian,bx_age);
    let dis_be = tool.dis_bf(bfl,bx_be,bx_nian);
    if(type == 'usd') {
        exchangeRateMethods.getMoneyRate(1).then((result) => {
            //汇率转换
            let returnObj = {
                code:1,
                data:{
                    changeBe:bx_be * parseFloat(result),
                    guranteed:dis_be,
                    changeBaofei:dis_be * parseFloat(result)
                }
            }
            res.send(returnObj)
        })
    }
    if(type == 'rmb'){
        exchangeRateMethods.getMoneyRate(1).then((result) => {
            let intBaoe = parseFloat(bx_be / parseFloat(result)).toFixed(2);
            //汇率转换保额
            dis_be = parseFloat(tool.dis_bf(bfl,intBaoe , bx_nian)).toFixed(2);
            let intBaofei = dis_be * parseFloat(result);
            //汇率转换
            let returnObj = {
                code:1,
                data:{
                    changeBe:intBaoe,
                    guranteed:dis_be,
                    changeBaofei:intBaofei
                }
            }
            res.send(returnObj)

        })
    }
})

module.exports = app