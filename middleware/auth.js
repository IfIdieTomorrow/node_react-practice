const {User} = require("../model/User");

let auth = (request ,response, next) =>{
    
    // 인증 처리를 하는곳
    
    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = request.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 찾는다
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return response.json({
            isAuth : false,
            err : true
        })
        // 유저가 있으면 인증 OK
        request.token = token;
        request.user = user;
        next();
    });
}

module.exports = {auth};