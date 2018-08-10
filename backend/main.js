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


app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'jade');

app.set('views', 'views');

//计算保费
app.post('/getCiebf' , (req , res) => {
  let sex = req.body.sex , age = req.body.calYears , insuranceYears = req.body.giveMoneyYear , isSmoke = req.body.smoke , baoe = req.body.be ;
  let bfl = tool.chk_bfl(sex , isSmoke , insuranceYears , age); //计算保费率
  let dis_be = Math.round(tool.dis_bf(bfl,baoe));
  let type = req.body.type;
  if(type == 'usd') {
    exchangeRateMethods.getMoneyRate(1).then((result) => {
      //汇率转换
      let returnObj = {
        code:1,
        data:{
          changeBe:baoe * parseFloat(result),
          guranteed:dis_be,
          changeBaofei:dis_be * parseFloat(result)
        }
      }
      res.send(returnObj)
    })
  }

  if(type == 'rmb'){
    exchangeRateMethods.getMoneyRate(1).then((result) => {
      let intBaoe = parseFloat(baoe / parseFloat(result)).toFixed(2);
      //汇率转换保额
      dis_be = Math.round(tool.dis_bf(bfl,intBaoe));
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
});

//计算保额
app.post('/getCiebe' , (req , res) => {
  if(req.body.type == 'usd'){
    let sex = req.body.sex , age = req.body.calYears , insuranceYears = req.body.giveMoneyYear , isSmoke = req.body.smoke , bf = req.body.bf ;
    let be = tool.dis_be(sex,age,insuranceYears,isSmoke,bf).toFixed(2); //先算取保额，然后再将这个保额再计算一遍保费
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

    exchangeRateMethods.getMoneyRate(1).then((result) => {
      let returnObj = {
        code:1,
        data:{
          be:be,
          insurance_money:bf,
          changeBaofei:bf * parseFloat(result),
          changeBaoe:be * parseFloat(result)
        }
      }
      res.send(returnObj)
    })
  }

  if(req.body.type == 'rmb'){
    let sex = req.body.sex , age = req.body.calYears , insuranceYears = req.body.giveMoneyYear , isSmoke = req.body.smoke , bf = req.body.bf ;

    exchangeRateMethods.getMoneyRate(1).then((result) => {
      //人民币保费转换成保额
      let changeBf = Math.round(parseFloat(bf / parseFloat(result)));
      let changeBe = tool.dis_be(sex,age,insuranceYears,isSmoke,changeBf).toFixed(2); //先算取保额，然后再将这个保额再计算一遍保费
      if(changeBe<2){
        changeBe=2;
      } //如果保额不足2万，自动以2万计算
      if(age>=18){
        if(changeBe>50){changeBe = 50}; //成年人的保额不能高于50W美元
      }else{
        if(changeBe>40){changeBe = 40}; //未成年人的保额不能高于50W美元
      }

      var bfl = tool.chk_bfl(sex,isSmoke,insuranceYears,age); //查保费率
      bf = Math.round(tool.dis_bf(bfl,changeBe)); //重新计算保费

      let returnObj = {
        code:1,
        data:{
          be:changeBe,
          insurance_money:bf,
          changeBaofei:bf * parseFloat(result),
          changeBaoe:changeBe * parseFloat(result)
        }
      }
      res.send(returnObj)
    })
  }

});

app.get('/demo' , (req , res) => {
  res.send('hello world');
})



app.use('/makeplain' , require('./route/makePlain'));
app.use('/getrate' , require('./route/getRate'));
app.use('/getCirBf' , require('./route/calculateCirBf'));
app.use('/getCirBe' , require('./route/calculateCirBe'));
app.use('/getCimBf' , require('./route/calculateCimBf'));
app.use('/getCimBe' , require('./route/calculateCimBe'));
app.use('/getEgsBf' , require('./route/calculateEgsBf'));
app.use('/getEgsBe' , require('./route/calculateEgsBe'));
app.use('/makeCimPlain' , require('./route/makeCimPlain'));
app.use('/makeCirPlain' , require('./route/makeCirPlain'));
app.use('/makeEgsPlain' , require('./route/makeEgsPlain'));

app.listen(3006);