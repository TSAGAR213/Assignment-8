const express=require('express');
const dotenv = require('dotenv');
const jwt=require("jsonwebtoken")
const router=express.Router();

let Post=require("./models/postModel");
const postModel = require('./models/postModel');


dotenv.config();

router.post("/posts",(req,res)=>{
    let {title, body, image}=req.body;

   
jwt.verify(req.headers.authorization,process.env.KEY,(err,decode)=>{
    if(err)
    {
        res.json({message:err})
    }
    else
    {
        let new_post=new Post({
            title,body,image,user:decode.id
        })
        new_post.save()
        .then(data=>{
            res.json({
                status:"Post created",
                data:data
            })
        })
        .catch(e=>{
            res.json({message:e})
        })
    }
})  
})

router.put("/posts/:postId",(req,res)=>{
    let postId=req.params['postId'];
    let incData=req.body;
    jwt.verify(req.headers.authorization,process.env.KEY,(err,decode)=>{
        if(err)
        {
            res.json({message:err})
        }
        else
        {
            postModel.findById(postId)
            .then(data=>{
              if(data.user==decode.id)
              {
                  postModel.findByIdAndUpdate(postId,incData,{useFindAndModify: false})
                  .then(data=>{
                    res.json({status:'Success',data:data})
                  })
                  .catch(e=>{
                    res.json({status:"error",message:e.message})
                  })
                
              }
              else
              {
                res.json({status:"error",message:`User Id doesn't match from posts`})
              }
            })
            .catch(e=>{
                res.status(404).json({message:e})
            })
        }
    })  
})



router.delete("/posts/:postId",(req,res)=>{
    let postId=req.params['postId'];
    jwt.verify(req.headers.authorization,process.env.KEY,(err,decode)=>{
        if(err)
        {
            res.json({message:err})
        }
        else
        {
            postModel.findById(postId)
            .then(data=>{
              if(data.user==decode.id)
              {
                  postModel.findByIdAndDelete(postId)
                  .then(data=>{
                    res.json({status:'Successfully deleted'})
                  })
                  .catch(e=>{
                    res.json({status:"error",message:e.message})
                  })
                
              }
              else
              {
                res.json({status:"error",message:`User Id doesn't match from posts`})
              }
            })
            .catch(e=>{
                res.status(404).json({message:e})
            })
        }
    })  
})

module.exports=router;