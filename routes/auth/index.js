const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require('../middleware')
const authCtrls = require("./auth.ctrl");
const auth = express.Router();

auth.use((req, res, next) => {
  console.log("API for auth");
  next();
})
auth.post("/idexists", authCtrls.idExists);
auth.get("/", authCtrls.input);
auth.post("/login", isNotLoggedIn, authCtrls.login)

module.exports = auth;
