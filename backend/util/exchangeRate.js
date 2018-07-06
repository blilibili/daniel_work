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

let methods = {
  changeUSDToCNY:changeUSDToCNY
}

module.exports = methods;