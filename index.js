const express=require('express');
const dotenv = require('dotenv');
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt');
const saltRounds=10;
const app=express();
const mongoose=require('mongoose');
const PORT=3000;
let User=require("./models/Usermodel");
let postRoute=require("./postRoutes");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

mongoose.connect(process.env.DATABASE_URL)
.then(()=>{console.log('connected to Database')})
.catch(e=>{console.log('error',e.message)})

app.post("/register",(req,res)=>{
    let {name,email,password}=req.body;

    bcrypt.hash(password,saltRounds)
    .then((hash)=>{
        let new_user=new User({
            name:name,
            email:email,
            password:hash
        })

        new_user.save()
        .then(data=>{
            res.json({
                status:"success",
                data:data
            })
        })
        .catch(e=>{
            res.json({
                status:"error",
                message:e.message
            })  
        })

    })

})



app.post("/login",(req,res)=>{
    let {email,password}=req.body;
    User.findOne({email,password})
    .then(data=>{
        jwt.sign({id:data.id,email:data.email},process.env.KEY,{ algorithm: 'HS256'},(err,token)=>{
           if(err)
           { console.log(err)
            res.json({message:err.message})
           }
           else
           {
            res.json({
            status:"success",
            token:token
            })
           }
        })
    })
    .catch(e=>{
        console.log(e)
        res.json({message:e.message})
    })
})

app.use("/",postRoute)

app.listen(PORT,()=>{
    console.log('sever running at http://localhost:3000/')
})
