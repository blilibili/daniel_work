const express = require('express');
const app = express();
let router = express.Router();
let tool = require('../util/Non-Guaranteed_Bonus');
let changeRate = require('../util/exchangeRate');
let multer  = require('multer');
var fs = require('fs');
var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './upload/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, req.body.pro + '-' + Date.now() + '.png');
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

app.post('/' ,upload.single('file') , (req , res) => {
    let file = req.file;
    res.send({code: '0' , path:file.path});
});

module.exports = app