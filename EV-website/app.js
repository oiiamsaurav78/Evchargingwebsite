require('dotenv').config()
const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
const bcrypt=require("bcrypt");

const noOfSaltRounds=10;


mongoose.connect('mongodb+srv://adityapandey3082004:9347158680@cluster0.sy335ht.mongodb.net/evusers');
const evuserSchema=new mongoose.Schema({
    username:String,
    name:String,
    email:String,
    password:String
});

const EVUSER=mongoose.model("EVUSER",evuserSchema)

app.route("/")
.get(function(req,res){
    res.sendFile(__dirname+"/index.html")
})


app.route("/login")
.get((req,res)=>{
    res.sendFile(__dirname+"/login.html")
})
.post((req,res)=>{

    const email=req.body.Email_login;
    const password=req.body.passwordLogin;
    EVUSER.find({email:email})
    .then((founditem)=>{
        founditem.forEach((item)=>{
            bcrypt.compare(password,item.password)
            .then((result)=>{
                if(result===true){
                    res.redirect("/dashboard")
                }else{
                    res.sendFile(__dirname+"/login2.html");
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        
    })
    .catch((err)=>{
        console.log(err)
    })
})


app.route("/register")
.get((req,res)=>{
    res.sendFile(__dirname+"/regi.html")
})
.post((req,res)=>{
    const username=req.body.userName;
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password

    bcrypt.hash(password,noOfSaltRounds)
    .then((hash)=>{
        const evuser=new EVUSER({
            username:username,
            name:name,
            email:email,
            password:hash
        })
        evuser.save()
        res.redirect("/dashboard")
    })
    .catch((err)=>{
        console.log(err)
    })

})

app.route("/bookslot")
.get((req,res)=>{
    res.sendFile(__dirname+"/bookaslot.html")
})
.post((req,res)=>{
    res.redirect("/form")
})
.post((req,res)=>{
    res.redirect("/bookslot")
})

app.get("/dashboard",(req,res)=>{
    res.sendFile(__dirname+"/dashboard.html")
})

app.get("/form",(req,res)=>{
    res.sendFile(__dirname+"/form.html")
})


app.listen(process.env.PORT || 3000,function(){
    console.log("server successfully started on port 3000")
})