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

let users=[]
let password="hola123"
bcrypt.hash(password,SALT,(err,hash)=>{
    let user={email:"rodri@rodri",pass:"",username:"rodrigol"}
    if(!err){
        user.pass=hash
        users.push(user)
    }
})
bcrypt.hash(password,SALT,(err,hash)=>{
    let user={email:"ema@ema",pass:"",username:"emaRose"}
    if(!err){
        user.pass=hash
        users.push(user)
    }
})
bcrypt.hash(password,SALT,(err,hash)=>{
    let user={email:"nahu@nahu",pass:"",username:"nahuCua"}
    if(!err){
        user.pass=hash
        users.push(user)
    }
})
bcrypt.hash(password,SALT,(err,hash)=>{
    let user={email:"ian@ian",pass:"",username:"ianP"}
    if(!err){
        user.pass=hash
        users.push(user)
    }
})


app.get("/users",(req,res)=>{
    res.send(users);
})

app.get("/user/:username",(req,res)=>{
    const username= req.params.username;

    users.find((user)=>{
        if(user.username==username){
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

app.post("/verify/:user/:pass",(req,res)=>{

    const user= req.params.user;
    const pass= req.params.pass;
   
    users.find((el)=>{
        if(el.username== user){
            bcrypt.compare(pass,el.pass,(err,hash)=>{
                if(!err){
                    res.send(hash);
                }
            });
        }
    });
            
           
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
      