var express=require('express');
var router=express.Router();
var User=require('../models/users');
var Content=require('../models/Content');
var responData;
router.use(function(req,res,next){
    responData={
        code:0,
        message:''
    }
    next();
})

router.post('/user/register',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    var repassword = req.body.repassword;

    if(username == ''){
        responData.code=1;
        responData.message='账号不能为空';
        res.json(responData);
        return;
    }
    if(password == ''){
        responData.code=2;
        responData.message='密码不能为空';
        res.json(responData);
        return;
    }
    if(password != repassword){
        responData.code=3;
        responData.message='2次密码不一致';
        res.json(responData);
        return;
    }

    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responData.code=4;
            responData.message='用户已被注册';
            res.json(responData);
        return;
        }
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){
        
        responData.message='注册成功';
        res.json(responData);
    })


    
});
router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    console.log(username + '--'+password);
    if(username == '' || password == ''){
        responData.code = 1;
        responData.message = '用户名和密码不能为空';
        res.json(responData);
        return;
    }
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responData.code = 2;
            responData.message = '用户名或密码错误';
            res.json(responData);
            return;
        }
        responData.message = '登陆成功';
        responData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        }
        req.cookies.set('userInfo',JSON.stringify(
            {
                _id:userInfo._id,
                username:userInfo.username
            }
        ));
        res.json(responData);
    })

})
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    responData.message = '退出成功！';
    res.json(responData);
})
//展示评论
router.get('/comment',function(req,res){
    var contentId = req.query.contentId || '';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        responData.data = content;
        res.json(responData);
    })
})
//评论提交
router.post('/comment/post',function(req,res){
    var contentId = req.body.contentId || '';
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.messageContent
    };
    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        
        responData.message = '评论成功！';
        responData.data = newContent;
        res.json(responData);
    })

})
module.exports = router;