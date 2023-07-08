const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require('../middleware')
const authCtrls = require("./auth.ctrl");
const auth = express.Router();

auth.use((req, res, next) => {
  console.log("API for auth");
  next();
})
auth.post("/idExists", authCtrls.idExists);
auth.get("/", authCtrls.input);
auth.post("/login", isNotLoggedIn, authCtrls.login);
auth.post("/signUp", isNotLoggedIn, authCtrls.signUp);
auth.get("/isLogined", (req, res, next) => {
  console.log(req.user);
  console.log(req.cookies);
  next()
},isLoggedIn, (req, res, next) => {
  const {email, userName, password } = req.user;
  console.log(email);
  console.log(userName);
  console.log(req.user);
  next();
});

module.exports = auth;
