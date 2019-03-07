//express框架
var express = require("express");
//引用模块管理
var swig = require("swig");
//链接mongodb数据库
var mongoose=require('mongoose');
//用于post提交过来的数据
var bodyParse=require('body-parser');
//引用cookies模块
var cookies = require('cookies');

var User=require('./models/users');

var app = express();
//模板引性，方法
app.engine('html',swig.renderFile);
//设置模板文件的存放目录，1不变
app.set('views','./views');
//注册所使用的末班引擎，1不变
app.set('view engine','html');
//开发过程中需要取消模板缓存
swig.setDefaults({cache:false});

//设置静态文件的托管,公共的css js等
app.use('/public',express.static( __dirname + '/public'));
//bodyParse设置
app.use(bodyParse.urlencoded({extended:true}));
//设置cookie
app.use(function(req,res,next){
    req.cookies = new cookies(req,res);
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            
            User.findById(req.userInfo._id).then(function(userInfo){
            
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
               
                next();
            });
          
           
        }
        catch(error){
            console.log(error);
            next();
        }
    }else{
        next();
    }

})
/*
    根据不同的功能划分不同的模块
*/
//前端的
app.use('/',require('./routers/main'));
//后台的
app.use('/admin',require('./routers/admin'));
//api
app.use('/api',require('./routers/api'));

/*
app应用入口
*/
// app.get("/",function(req,res){
//     /*
//     读取views目录下的指定文件，解析并返回给客户端 第一个参数是模板文件相对于views目录来的
//     */
//     res.render('index');
// })
//css文件的一种加载方式
    // app.get('./main.css',function(req,res){
    //     res.setHeader("content-type","text/css");
    //     res.send("body{background:red}")
    // })
mongoose.connect('mongodb://localhost:27017/my-boke',{useNewUrlParser:true});
mongoose.connection.on('error', () => {
    console.log('Mongoose connection error')
});
mongoose.connection.on('open', () => {
    console.log('Mongoose connection success');
    console.log("localhost :3000");
    app.listen(3000);
});
