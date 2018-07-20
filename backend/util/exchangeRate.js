let request = require('request');
let cheerio = require('cheerio');
let sqlConfig = require('../util/sqlConfig');

function forMatTime(inputTime , methods){
  let date = new Date(inputTime);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  switch (methods){
    case 'day':
      return y + '-' + m + '-' + d;
      break;
    case 'seconds':
      return y + '-' + m + '-' + d + ' ' + h + ':' +minute + ':' + second;
      break;
    default:
      return '参数错误请检查';
      break;
  }
}

function changeUSDToCNY(usd){
  return new Promise((resolve => {
    request('https://finance.google.cn/finance/converter?a='+ usd +'&from=USD&to=CNY&meta=ei%3DbcI9W7CQH83E0QTLi4OIBg' , function(err , response , body){
      let $ = cheerio.load(body);
      let changeCNY = $('.bld').text();
      resolve(changeCNY);
    })
  }))
}

function changeCNYToUSD(cny){
  return new Promise((resolve => {
    request('https://finance.google.cn/finance/converter?a='+cny+'&from=CNY&to=USD&meta=ei%3DkZZAW9iXNJCb0ATU7pT4BQ' , function(err , response , body){
      let $ = cheerio.load(body);
      let changeUSD = $('.bld').text();
      resolve(changeUSD);
    })
  }))
}

function getMoneyRate(usd){
  return new Promise((resolve => {
    let sql = "select * from rate where time = ?";
    let tmp = [forMatTime(new Date().getTime() , 'day')];
    sqlConfig.query(sql , tmp, function(err, rows, fields) {
      if (err) {
        console.log('[query] - :' + err);
        return;
      }
      //row.length == 1 已经拿到汇率
      if(rows.length == 1){
        resolve(rows[0]['rate'])
      }else{
        //没有拿到汇率 去取汇率
        request('https://finance.google.cn/finance/converter?a='+ usd +'&from=USD&to=CNY&meta=ei%3DbcI9W7CQH83E0QTLi4OIBg' , function(err , response , body){
          let $ = cheerio.load(body);
          let usd = parseFloat($('#currency_converter_result').text().split(' ')[0]);
          let changeCNY = parseFloat($('.bld').text().split(' ')[0]);
          let rate = (changeCNY / usd).toFixed(3);
          let tmp = [rate , forMatTime(new Date().getTime() , 'day')];
          let sql = "insert into rate (rate , time) values(? , ?)";
          sqlConfig.query(sql , tmp, function(err, rows, fields) {
            if (err) {
              console.log('[query] - :' + err);
              return;
            }
            resolve(rate);
          });
        })
      }
    });
  }))
}

let methods = {
  changeUSDToCNY:changeUSDToCNY,
  changeCNYToUSD:changeCNYToUSD,
  getMoneyRate:getMoneyRate
}

module.exports = methods;