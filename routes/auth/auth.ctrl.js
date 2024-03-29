const passport = require('passport');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

exports.idExists = (req, res) => {
  console.log(`idExists Function, req: ${req}`);
  console.log(req.body);
  const id = req.body.id;
  getQueryResult(`SELECT * FROM userTable WHERE username="${id}";`)
    .then((data) => {
      console.log(data);
      res.json(JSON.stringify(data[0]));
    })
    .catch((err) => 
      console.error(err)
    );
}

// 로그인 기능 체크를 위한 임시 페이지
exports.input = (req, res) => {
  console.log("input function");
  var title = '로그인';
  var html = `
          <h2>로그인</h2>
          <form action="/auth/login" method="post">
          <p><input class="login" type="text" name="email" placeholder="이메일"></p>
          <p><input class="login" type="password" name="password" placeholder="비밀번호"></p>
          <p><input class="btn" type="submit" value="로그인"></p>
          </form>            
          <p>계정이 없으신가요?  <a href="/auth/register">회원가입</a></p> 
      `;
  res.send(html);
}

exports.login = (req, res, next) => {
  console.log("login logic");
  console.log("body seems: ", req.body);

  if(req.body.snsId) {
    req.body = {...req.body, password: req.body.snsId};
  }
  
  // TODO: 카카오, google로 로그인할 때, 해당 소셜 메일을 받아와서 email 항목을 채우고
  // sns id를 암호화하여 password 필드를 채움
  // sns 로그인을 시도하는 경우, 해당 sns 계정 이메일 + snsId를 해시화한 password를 통해 local 로그인 시도
  // TODO: 프론트에서 email 수집 동의 항목 추가

  passport.authenticate("local", (authError, user, info) => {
    if(authError) {
      console.error(authError);
      return next(authError); // 에러처리 미들웨어로 보낸다.
    }
    if(!user){
      res.status(401);
      return res.send();
    }
    return req.login(user, loginError => {
      if(loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
}

exports.signUp = async (req, res, next) => {
  console.log("singUp logic")
  const { email, userName, password, snsId, provider } = req.body;
  try {
    // 기존에 해당 이메일로 가입한 사람이 있나 검사 (중복 가입 방지)
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      res.status(401);
      return res.json(JSON.stringify({result: "email already exists"})); // 에러페이지로 바로 리다이렉트
    }
    // 기존에 해당 snsId로 가입한 사람이 있나 검사 (중복 가입 방지)
    if (snsId && provider) {
      const snsExUser = await User.findOne({ where: { snsId, provider } });
      if (snsExUser) {
        return res.redirect("/signUp?error=exist");
      }
    }

    // local 계정, sns 계정 가입 기록이 모두 없는 경우에만 이후 코드를 실행할 수 있음
    /* local sign up */
    if (snsId == null) {
      // 정상적인 회원가입 절차면 해시화
      const hash = await bcrypt.hash(password, 12);
      // DB에 해당 회원정보 생성
      await User.create({
        email,
        userName,
        password: hash, // 비밀번호에 해시문자를 넣어준다.
      });
    } else {
      /* social sign up */
      console.log("sign up with sns");
      const hash = await bcrypt.hash(snsId, 12); // snsId를 local DB에 저장하기 위한 pw로 사용
      await User.create({
        email, // 유저가 sns에 가입한 email(정보 제공 동의)
        userName,
        password: hash,
        snsId,
        provider,
      });
    }
    
    res.status(201);
    res.set("Content-Type", "text/plain");
    return res.send("Signup Success!");
  } catch(err) {
    console.error(err);
    return next(err);
  }
}

exports.logout = (req, res, next) => {
  // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
  req.logout(err => {
    if (err) {
      return next(err);
    } else {
      req.session.destroy(); // 로그인인증 수단으로 사용한 세션쿠키를 지우고 파괴한다. 세션쿠키가 없다는 말은 즉 로그아웃 인 말.
      res.set("Content-Type", "text/plain");
      return res.send("Logout Success!");
    }
  });
}
