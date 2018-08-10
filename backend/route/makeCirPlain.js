const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/cir2/js/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');

app.post('/' , (req , res) => {

    let bx_area = req.body.living; //地区
    let bx_sex = req.body.sex; //性别
    let bx_age = parseInt(req.body.calYears); //年龄
    let bx_smoke = req.body.smoke; //是否吸烟
    let bx_nian = parseInt(req.body.giveMoneyYear); //供款年期
    let bx_be = req.body.be; //保额
    let bx_bf = Math.round(req.body.bf); //保费
    var x , tmp_bf = 0,arr_bf  = new Array();//记录保费数据
    let trHTML ="";
    let Payment_Item;




//basic_bf = chk_bfl(bx_sex,bx_smoke,bx_nian,bx_age)*10; //chk_bfl(bx_sex,bx_smoke,bx_nian,bx_age);

//arr_bf[i][j],j-0保单年度,1所缴保费总额,2保证退保金额,3非保证退保红利,4-退保总额,5-非保证特别红利,6-保额,7-赠送保额,8-理赔总额

    for (var i=1; i<=20; i++) //计算保费
    {
        arr_bf[i] = new Array() ;
        arr_bf[i][0] = i+bx_age;
        if (i<=bx_nian){ //计算累计保费
            arr_bf[i][1] = i*bx_bf;
        }else{
            arr_bf[i][1] = bx_nian*bx_bf;
        }
    }
//添加25年的记录
    arr_bf[25]  = new Array() ;
    arr_bf[25][0] = 25+bx_age;
    if (bx_nian == 25){
        arr_bf[25][1] = 25*bx_bf;
    }else{
        arr_bf[25][1] = bx_nian*bx_bf;
    }
//添加30年的记录
    arr_bf[30]  = new Array() ;
    arr_bf[30][0] = 30 + bx_age ;
    arr_bf[30][1] = bx_nian*bx_bf;
//添加66-101岁的记录
    var tmpAge=0;
    for (i=66; i<=101; i+=5){
        tmpAge = i-bx_age;
        arr_bf[i]  = new Array() ;
        arr_bf[i][0] = i ;
        if(tmpAge<= bx_nian ){
            arr_bf[i][1] = tmpAge*bx_bf;
        }else{
            arr_bf[i][1] = bx_nian*bx_bf;
        }
    }


    trHTML =""
    var k=0;
    var jj=10; //前10年额外赠送50%保额

    var arr_bonus = new Array();
    var arr_bonus2 = new Array();
//arr_bonus = GetBasic(bx_age,1); //求基础非保证退保红利
    arr_bonus = tool.GetBasic_Bonus(bx_age,0); //求基础非保证退保红
    var tmp_years;
    for (var x in arr_bf)
    {
        tmp_years = arr_bf[x][0] - bx_age;
        if ( arr_bf[x][0] > 85 ){  //如果到了85岁,那么保证退保价值=保额
            arr_bf[x][2] = bx_be*10000;
        }else { //否则保证退保价值 ＝ 保证退保率*保费


            arr_bf[x][2] = Math.round(tool.TuibaoRate(bx_nian,tmp_years)* arr_bf[x][1]);


        }
//计算非保证退保红利
        k++
        arr_bf[x][3] = Math.round(arr_bonus[k]*bx_be);  //求非保证退保红利
        arr_bf[x][4] = Math.round(arr_bf[x][2]) + Math.round(arr_bf[x][3]); //退保总额

//计算非保证理赔红利
//arr_bonus2 = GetBasic(bx_age,2);
        arr_bonus2 = tool.GetBasic_Bonus(bx_age,1); //求基础非保证理赔金额
        arr_bf[x][5] = Math.round(arr_bonus2[k]*bx_be);
        arr_bf[x][6] = Math.round(bx_be)*10000;//基本保额
//计算赠送保额前10年赠送如果小于18岁赠送70%保额，否则55%)
        if(tmp_years<=jj){
            if(bx_age>18){
                arr_bf[x][7] = Math.round(bx_be)*10000*0.55;
            }else{
                arr_bf[x][7] = Math.round(bx_be)*10000*0.70;
            }

        }else{
            arr_bf[x][7] = 0;
        }
//理赔总额
        arr_bf[x][8] = arr_bf[x][5]+arr_bf[x][6]+arr_bf[x][7];

    }

    var j = 0;
    let ageArr = [];
    let tmp = [];
    let count = 0;
    let cnyTmp = []
    //获取汇率
    changeRate.getMoneyRate(1).then((result) => {
        //arr_bf[i][j],j-0保单年度,1所缴保费总额,2保证退保金额,3非保证退保红利,4-退保总额,5-非保证特别红利,6-保额,7-赠送保额,8-理赔总额
        for (var x in arr_bf)
        {
            tmp[count] = {
                age:arr_bf[x][0],
                sum:arr_bf[x][1],
                changeSum:(arr_bf[x][1] * parseFloat(result)).toFixed(2),
                TB:Math.round(arr_bf[x][2]),
                changeTB:(arr_bf[x][2] * parseFloat(result)).toFixed(2),
                FTB:arr_bf[x][3],
                changeFTB:(arr_bf[x][3] * parseFloat(result)).toFixed(2),
                TBZ:arr_bf[x][4],
                changeTBZ:(arr_bf[x][4] * parseFloat(result)).toFixed(2),
                FBZTBH:arr_bf[x][5],
                changeFBZTBH:(arr_bf[x][5] * parseFloat(result)).toFixed(2),
                BE:arr_bf[x][6],
                changeBe:(arr_bf[x][6] * parseFloat(result)).toFixed(2),
                CSBE:arr_bf[x][6] + arr_bf[x][7],
                changeCSBE:((arr_bf[x][6] + arr_bf[x][7]) * parseFloat(result)).toFixed(2),
                ZSBE:arr_bf[x][7],
                changeZSBE:(arr_bf[x][7] * parseFloat(result)).toFixed(2),
                LPZE:arr_bf[x][8],
                changeLPZE:(arr_bf[x][8] * parseFloat(result)).toFixed(2),
                BF:bx_bf,
                changeBF:(bx_bf * parseFloat(result)).toFixed(2)
            }

            cnyTmp[count] = {
                age:arr_bf[x][0],
                sum:arr_bf[x][1],
                changeSum:Math.round(arr_bf[x][1] * parseFloat(result)),
                TB:Math.round(arr_bf[x][2]),
                changeTB:Math.round(arr_bf[x][2] * parseFloat(result)),
                FTB:arr_bf[x][3],
                changeFTB:Math.round(arr_bf[x][3] * parseFloat(result)),
                TBZ:arr_bf[x][4],
                changeTBZ:Math.round(arr_bf[x][4] * parseFloat(result)),
                FBZTBH:arr_bf[x][5],
                changeFBZTBH:Math.round(arr_bf[x][5] * parseFloat(result)),
                BE:arr_bf[x][6],
                changeBe:Math.round(arr_bf[x][6] * parseFloat(result)),
                CSBE:arr_bf[x][6] + arr_bf[x][7],
                changeCSBE:Math.round((arr_bf[x][6] + arr_bf[x][7]) * parseFloat(result)),
                ZSBE:arr_bf[x][7],
                changeZSBE:Math.round(arr_bf[x][7] * parseFloat(result)),
                LPZE:arr_bf[x][8],
                changeLPZE:Math.round(arr_bf[x][8] * parseFloat(result)),
                BF:bx_bf,
                changeBF:Math.round(bx_bf * parseFloat(result))
            }
            //j = parseInt(arr_bf[x][2])+parseInt(arr_bf[x][3]);
            // tmp['age'][count] = arr_bf[x][0];
            // tmp['sum'][count] = arr_bf[x][1];
            //trHTML += "<tr><td>"+x+"</td><td>"+arr_bf[x][0]+"岁</td><td>" + arr_bf[x][1] +"</td><td>" + arr_bf[x][2]+"</td><td>"+ arr_bf[x][3]+"</td><td>" +arr_bf[x][4]+"</td><td>"+arr_bf[x][6]+"</td><td>"+arr_bf[x][7]+"</td><td>"+arr_bf[x][5]+"</td><td>"+arr_bf[x][8]+"</td></tr>";
            count++;
        }

        res.send({
            code:1,
            age:bx_age,
            data:tmp,
            msg:'获取表格成功',
            rate:parseFloat(result),
            cnyTable:cnyTmp
        })
  });
});

module.exports = app