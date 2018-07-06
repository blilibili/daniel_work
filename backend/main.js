let express = require('express');
let app = express();
let tool = require('./util/Non-Guaranteed Bonus');
let bodyParser = require('body-parser');
let path = require('path');
let exchangeRateMethods = require('./util/exchangeRate');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');

app.set('views', 'views');

//计算保费
app.post('/getbf' , (req , res) => {
  let sex = req.body.sex , age = req.body.calYears , insuranceYears = req.body.giveMoneyYear , isSmoke = req.body.smoke , baoe = req.body.be ;
  let bfl = tool.chk_bfl(sex , isSmoke , insuranceYears , age); //计算保费率
  let dis_be = Math.round(tool.dis_bf(bfl,baoe));

  console.log(sex , isSmoke , insuranceYears , age);
  exchangeRateMethods.changeUSDToCNY(baoe).then((result) => {
    //保费汇率转换
    exchangeRateMethods.changeUSDToCNY(dis_be).then((resolve) => {
      let intBaoe = result.split(' ')[0];
      let intBaofei = resolve.split(' ')[0];
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
  });
});

//计算保额
app.post('/getbe' , (req , res) => {
  let sex = req.body.sex , age = req.body.calYears , insuranceYears = req.body.giveMoneyYear , isSmoke = req.body.smoke , bf = req.body.bf ;
  let be = tool.dis_be(sex,age,insuranceYears,isSmoke,bf).toFixed(2); //先算取保额，然后再将这个保额再计算一遍保费
  console.log(sex,age,insuranceYears,isSmoke,bf , be);
  if(be<2){
    be=2;
  } //如果保额不足2万，自动以2万计算
  if(age>=18){
    if(be>50){be = 50}; //成年人的保额不能高于50W美元
  }else{
    if(be>40){be = 40}; //未成年人的保额不能高于50W美元
  }

  var bfl = tool.chk_bfl(sex,isSmoke,insuranceYears,age); //查保费率
  bf = Math.round(tool.dis_bf(bfl,be)); //重新计算保费

  exchangeRateMethods.changeUSDToCNY(be).then((result) => {
    exchangeRateMethods.changeUSDToCNY(bf).then((resolve) => {
      let returnObj = {
        code:1,
        data:{
          be:be,
          insurance_money:bf,
          changeBaofei:resolve.split(' ')[0],
          changeBaoe:result.split(' ')[0]
        }
      }
      res.send(returnObj)
    })
  })
});

app.use('/makeplain' , require('./route/makePlain'))

app.listen(3000);