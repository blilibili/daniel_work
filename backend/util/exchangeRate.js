let request = require('request');
let cheerio = require('cheerio');

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

let methods = {
  changeUSDToCNY:changeUSDToCNY,
  changeCNYToUSD:changeCNYToUSD
}

module.exports = methods;