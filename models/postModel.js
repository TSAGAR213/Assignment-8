const mongoose=require('mongoose');

let postSchema=new mongoose.Schema( {
     title:{type:String,required:true},
     body:{type:String,required:true},
     image:{type:String,required:true},
     user : {type:mongoose.Schema.Types.ObjectId,ref:'users',required:true}
 })

let postModel=mongoose.model("posts",postSchema);

module.exports=postModel;