require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const md5 = require("md5");
//const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/Secrets", {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify:false });

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

//userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets",function(req,res){
  res.render("secrets");
});

app.get("/submit",function(req,res){
  res.render("submit");
});

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
    email: req.body.username,
    password: hash
    });
      newUser.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.render("secrets");
    }
    });
  });
});

app.post("/login",function(req,res){
  const username= req.body.username;
  const password= req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(!err){
       if(foundUser){
          bcrypt.compare(password, foundUser.password, function(err, result) {
               if(result==true){
                   res.render("secrets");
              }else{ res.send("check your credentials again");
              }
           });
       }else{
        res.send("user not found. Make sure you registered already");
      }
    }else{
      res.send(err);
    }
  });
});


app.listen(3000,function(req,res){
  console.log("server started successfully");
});
