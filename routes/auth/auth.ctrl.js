const passport = require('passport');

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
  console.log(req.body);
  passport.authenticate("local", (authError, user, info) => {
    if(authError) {
      console.error(authError);
      return next(authError); // 에러처리 미들웨어로 보낸다.
    }
    if(!user){
      return res.redirect(`/?loginError=${info.message}`);
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

exports.register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
}
