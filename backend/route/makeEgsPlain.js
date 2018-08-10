const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/egs/js/Non-Guaranteed_Bonus');
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




    switch(bx_nian)
    {
        case 0:
            Payment_Item = 1;
            break;
        case 2:
            Payment_Item = 8;
            break;
        case 3:
            Payment_Item = 12  ;
            break
        default:
            Payment_Item = 5;
    }
    /*
    计算收益数据
    arr_bf[第几年][0]  - 年龄[1]  - 保费[2]  - 保证价值[3]  - 退保归原红利[4]  - 退保特别红利[5]  - 退保总额 [6]  - 最低身故赔偿 [7]  - 身故归原红利
     [8]  - 身故特别红利			   [9]  - 身故赔偿总额			   [10]  - 实际身故赔偿(最低身故赔偿与身故赔偿总额之高者)
    */

    for (var i=1; i<=101-bx_age; i++) //求到客户101岁时的利益表
    {
        arr_bf[i] = new Array() ;
        arr_bf[i][0] = i+bx_age; //年龄
        if (i <= Payment_Item){ //计算累计保费
            arr_bf[i][1] = i * bx_bf;
        }else{
            arr_bf[i][1] = Payment_Item * bx_bf;
        }
//求保证价值
        arr_bf[i][2]= tool.GetBasic_Bonus(bx_nian,0,i)*bx_be;
//求退保归原红利
        arr_bf[i][3]= tool.GetBasic_Bonus(bx_nian,3,i)*bx_be;
//求退保特别红利
        arr_bf[i][4]= tool.GetBasic_Bonus(bx_nian,4,i)*bx_be;
//求退保利益总额
        arr_bf[i][5]= arr_bf[i][2] + arr_bf[i][3] +arr_bf[i][4];
//求最低身故赔偿
//前11年每年额外增加3.5%的保费——前11年=保费*n*(1+3.5%*(i-1)),如果供款12年，那么第12年仍然有额外35%的赔偿
        if(i<=11){
            arr_bf[i][6] =   arr_bf[i][1]*(1+0.035*(i-1));
        }else{
            if(Payment_Item == 12 ){
                if(i == 12){
                    arr_bf[i][6] =   arr_bf[i][1]*(1+0.35);
                }else{
                    arr_bf[i][6] = arr_bf[12][6] ;
                }
            }else{
                arr_bf[i][6] = arr_bf[11][6] ;
            }
        }
//求身故归原红利
        arr_bf[i][7]= tool.GetBasic_Bonus(bx_nian,1,i)*bx_be;
//求身故特别红利
        arr_bf[i][8]= tool.GetBasic_Bonus(bx_nian,2,i)*bx_be;
//求身故赔偿总额
        arr_bf[i][9]= arr_bf[i][2] + arr_bf[i][7] +arr_bf[i][8];
//求实际赔偿金额（ arr_bf[i][9]跟arr_bf[i][6] 取最高者
        if(arr_bf[i][9]>arr_bf[i][6]){arr_bf[i][10] = arr_bf[i][9]}else{arr_bf[i][10] = arr_bf[i][6]}

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
                FTB:Math.round(arr_bf[x][3] +arr_bf[x][4]),
                changeFTB:((arr_bf[x][3]+arr_bf[x][4]) * parseFloat(result)).toFixed(2),
                TBZ:arr_bf[x][5],
                changeTBZ:(arr_bf[x][5] * parseFloat(result)).toFixed(2),
                ZDSGPZ:parseInt(arr_bf[x][6]),
                changeZDSGPZ:(arr_bf[x][6]* parseFloat(result)).toFixed(2),
                FBZTBH:arr_bf[x][5],
                changeFBZTBH:(arr_bf[x][5] * parseFloat(result)).toFixed(2),
                BE:Math.round(arr_bf[x][6]),
                changeBe:(arr_bf[x][6] * parseFloat(result)).toFixed(2),
                BZLP:Math.round(arr_bf[x][2]),
                changeBZLP:(Math.round(arr_bf[x][2]) * parseFloat(result)).toFixed(2),
                FBZLPHL:parseInt(arr_bf[x][7] + arr_bf[x][8]),
                changeFBZLPHL:parseInt(arr_bf[x][7] + arr_bf[x][8])* parseFloat(result).toFixed(2),
                LPZE:arr_bf[x][8],
                changeLPZE:(arr_bf[x][8] * parseFloat(result)).toFixed(2),
                PZZE:Math.round(arr_bf[x][9]),
                changePZZE:(arr_bf[x][9] * parseFloat(result)).toFixed(2),
                SJPZZE:Math.round(arr_bf[x][10]),
                changeSJPZZE:(arr_bf[x][10] * parseFloat(result)).toFixed(2),
                BF:bx_bf,
                changeBF:(bx_bf * parseFloat(result)).toFixed(2)
            }

            cnyTmp[count] = {
                age:arr_bf[x][0],
                sum:Math.round(arr_bf[x][1]* parseFloat(result)),
                changeSum:Math.round(arr_bf[x][1] * parseFloat(result)),
                TB:Math.round(arr_bf[x][2]* parseFloat(result)),
                changeTB:(arr_bf[x][2] * parseFloat(result)).toFixed(2),
                FTB:Math.round((arr_bf[x][3] +arr_bf[x][4])* parseFloat(result)),
                changeFTB:((arr_bf[x][3]+arr_bf[x][4]) * parseFloat(result)).toFixed(2),
                TBZ:Math.round(arr_bf[x][5]* parseFloat(result)),
                changeTBZ:(arr_bf[x][5] * parseFloat(result)).toFixed(2),
                ZDSGPZ:Math.round(arr_bf[x][6]* parseFloat(result)),
                changeZDSGPZ:(arr_bf[x][6]* parseFloat(result)).toFixed(2),
                FBZTBH:Math.round(arr_bf[x][5]* parseFloat(result)),
                changeFBZTBH:(arr_bf[x][5] * parseFloat(result)).toFixed(2),
                BE:Math.round(arr_bf[x][6]* parseFloat(result)),
                changeBe:(arr_bf[x][6] * parseFloat(result)).toFixed(2),
                BZLP:Math.round(arr_bf[x][2]* parseFloat(result)),
                changeBZLP:(Math.round(arr_bf[x][2]) * parseFloat(result)).toFixed(2),
                FBZLPHL:Math.round((arr_bf[x][7] + arr_bf[x][8])* parseFloat(result)),
                changeFBZLPHL:parseInt(arr_bf[x][7] + arr_bf[x][8])* parseFloat(result).toFixed(2),
                LPZE:Math.round(arr_bf[x][8] * parseFloat(result)),
                changeLPZE:(arr_bf[x][8] * parseFloat(result)).toFixed(2),
                PZZE:Math.round(arr_bf[x][9] * parseFloat(result)),
                changePZZE:(arr_bf[x][9] * parseFloat(result)).toFixed(2),
                SJPZZE:Math.round(arr_bf[x][10]* parseFloat(result)),
                changeSJPZZE:(arr_bf[x][10] * parseFloat(result)).toFixed(2),
                BF:bx_bf,
                changeBF:(bx_bf * parseFloat(result)).toFixed(2)
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