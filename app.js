const express= require('express');
const cors= require('cors');
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const multer = require('multer');
const uuid= require('uuid')

const PORT= process.env.PORT || 3100;
const SALT =10;
const app= express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

let users=[
    {email:"rodri@rodri",pass:"rodri123",userName:"rodrigol"},
    {email:"ema@ema",pass:"ema123",userName:"emaRose"},
    {email:"nahu@nahu",pass:"nahu123",userName:"nahuCua"},
    {email:"ian@ian",pass:"ian123",userName:"ianP"},
]

app.get("/users",(req,res)=>{
    res.send(users);
})

app.get("/user/:email",(req,res)=>{
    const email= req.params.email;

    users.find((user)=>{
        if(user.email==email){
            res.send(user);
        }
    });
    res.send(false);
});

app.post("/user/:email/:pass/:username",(req,res)=>{

    const {email,pass,username}= req.params;


    let user={email,pass,username};

    bcrypt.hash(user.pass,SALT,(err,hash)=>{
        if(!err){
            user.pass=hash;
            users.push(user)
        }
    })
    const payload={
        email:user.email,
        pass:user.pass,
        username:user.username,
        
    };
    jsonwebtoken.sign(payload,user.pass,(err,token)=>{
        if(!err){
            res.send(token)
        }
        else{
            res.send("dio error")
        }
    })
})

app.post("/user/verify/:email/:pass",(req,res)=>{

    const token= req.headers.authorization.split(" ")[1]
    const email= req.params.email;
    const pass= req.params.pass;

    if(token){
        jsonwebtoken.verify(token,pass,(err,payload)=>{
            if(!err){
                users.find((user)=>{
                    if(user.email== email){
                        bcrypt.compare(pass,user.pass,(err,hash)=>{
                            if(!err){
                                res.send(true);
                            }
                        });
                    }
                });
            }
            else
            res.send(false)
        });
    }
    else
     res.send(false);
   
});
app.delete("/delete/:email",(req,res)=>{

    let{email}= req.params;
    let flag=0;
    users=users.filter((el)=>{
        if(el.email!=email){
            return el
        }
        flag=1
    })
    if(flag==0){
        res.send(false)
    }
    else{
        res.send(true)
    }

})

app.listen(PORT,()=>{
    console.log("start server")
})
      