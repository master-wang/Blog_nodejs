var mongoose=require('mongoose');
//用户表结构
module.exports = new mongoose.Schema({
    //关联字段
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    title:String,
    description:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    views:{
        type:Number,
        default:0
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    //存储评论
    comments:{
        type:Array,
        default:[]
    }
});