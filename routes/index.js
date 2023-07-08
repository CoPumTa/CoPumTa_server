const express = require("express");
const { User } = require('../models');

const router = express.Router();
const auth = require("./auth");

router.get("/", (req, res) => {
  // const result = User.create({ // 생성된 쿼리 결과를 얻는다.
  //   email: "a@a",
  //   userName: "aaa",
  //   password: "1234",
  // });
  res.locals.title = "Node Chat!";
  res.json("index");
});
router.use("/auth", auth);

module.exports = router;
