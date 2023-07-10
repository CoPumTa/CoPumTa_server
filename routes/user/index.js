const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require('../middleware')
const userCtrl = require("./user.ctrl");
const user = express.Router();

user.use((req, res, next) => {
  console.log("API for user");
  next();
})

// test API to make dummy data
user.post("/postInfo", isLoggedIn, userCtrl.postInfo);
user.get("/getInfo", isLoggedIn, userCtrl.getInfo);


user.get("/test", isLoggedIn, userCtrl.test);
user.get("/getFriends", isLoggedIn, userCtrl.getFriends);
user.post("/friendRequest", isLoggedIn, userCtrl.friendRequest);
user.post("/processRequest", isLoggedIn, userCtrl.processRequest);

module.exports = user;
