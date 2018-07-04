let express = require('express');
let app = express();
let tool = require('./util/Non-Guaranteed Bonus');
let bodyParser = require('body-parser');
var path = require('path');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');

app.set('views', 'views');


app.get('/demo' , (req , res) => {
  let guranteed = Math.round(tool.chk_bfl(0 , 0 , 20 , 30));
  let baoe = Math.round(tool.dis_bf(guranteed,40));
  console.log(guranteed , baoe);
  res.send('hello')
});

//计算保额
app.get('/baoe' , (req , res) => {
})

app.listen(3000);