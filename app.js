//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const secret = process.env.SECRET;

const userSchema = new mongoose.Schema ({
  username:String,
  password:String
});


const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});


app.post("/register", function(req,res){

  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const user = new User({
      username: req.body.username,
      password:hash
    });
    user.save(function(err){
      if (!err){
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });

});

app.post("/login", function(req,res){
  const username= req.body.username;
  const password= req.body.password;
  console.log("posted");

  User.findOne({username:username},function(err,user){
    if (err){
      console.log(err);
    } else {
      console.log("found user " + user.password);
      bcrypt.compare(password,user.password,function(err,result){
        console.log(result);
        if (result === true) {
          res.render("secrets");
        } else {
          res.render("login");
        }
      });
    }


  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
