var express = require("express");
var app=express();
//让服务器可以处理提交过来的json数据
app.use(express.json())
//解决跨域问题
app.use(require('cors')());
//应用静态文件
app.use("/",express.static('public'));
//链接mongodb数据库
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/express-test',{useNewUrlParser:true});
var Product = mongoose.model('Product',new mongoose.Schema({
    title:String,
}))

    // Product.insertMany([
    //     {title:'1'},{title:"2",title:"3"}
    // ])

app.get("/user",function(req,res){
    res.send({
        id:"1",
        data:"1111111"
    });
});
app.get("/products",async function(req,res){
    //skip跳过条数，limit限制查询的条数
        //var data=await Product.find().skip(1).limit(2);
    //查询where
        // var data=await Product.find().where({
        //     title:"3"
        // })
    //排序查询
    var data=await Product.find().sort({_id:-1})
    res.send(
       data
    )
})
app.get("/products/:id",async function(req,res){
    var data=await Product.findById(req.params.id);
    res.send(
       data
    )
})
app.post("/products",async function(req,res){
    const data=req.body;
    const product=await Product.create(data)
    res.send(product);
})
app.put("/products/:id",async function(req,res){
    var data=await Product.findById(req.params.id);
    data.title=req.body.title;
    await data.save();
    res.send(data);
})
app.delete("/products/:id",async function(req,res){
    var data=await Product.findById(req.params.id);
    await data.remove();
    res.send({
        seccess:true
    });
})
app.listen(3000);
console.log("server to port localhost:3000");