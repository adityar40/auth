//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

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

userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

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
  const user = new User({
    username: req.body.username,
    password:req.body.password
  });
  user.save(function(err){
    if (!err){
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function(req,res){
  const username= req.body.username;
  const password= req.body.password;

  User.findOne({username:username},function(err,user){
    if (user.password === password) {
      res.render("secrets");
    } else {
      console.log(err);
      res.render("register");
    }
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
