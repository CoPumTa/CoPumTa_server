//* 사용자 미들웨어를 직접 구현

exports.isLoggedIn = (req, res, next) => {
  // isAuthenticated()로 검사해 로그인이 되어있으면
  if (req.isAuthenticated()) {
    console.log("loggined. call naext middleware");
     next(); // 다음 미들웨어
  } else {
     res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("not loggined. call naext middleware");
    next(); // 로그인 안되어있으면 다음 미들웨어
  } else {
     const message = encodeURIComponent('로그인한 상태입니다.');
     res.redirect(`/?error=${message}`);
  }
};

exports.initInfo = (req, res) => {
  console.log("initInfo logic");
  console.log("user info: ", req.user.dataValues.userId);
  UserInfo.create({
    userId: req.user.dataValues.userId,
  })
  return res.status(204).send();
}
