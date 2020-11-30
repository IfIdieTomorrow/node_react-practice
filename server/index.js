const express = require("express");
const app = express();
const port = 5000
const { User } = require("./model/User");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {auth} = require("./middleware/auth");
const db = require("./lib/mongodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser());

app.get("/", (request, response)=>{
    response.send("Hellow Express");
});

// 회원가입
app.post("/api/users/register", (request, response)=>{
    //회원가입할때 필요한 정보들을 client 에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.

    // 생성한 user 객체의 프로퍼티명과 데이터를 받는 파라미터명이 같아야 한다.
    const user = new User(request.body);

    user.save((err, userInfo)=>{
        if(err) return response.json({success : false, err});
        return response.status(200).json({
            success : true
        })
    });
});

app.post("/api/users/login", (request, response)=>{
    // 요청된 이메일을 데이터베이스에 있는지 찾는다
    User.findOne({ email : request.body.email }, (err, user)=>{
        if(!user){
            return response.json({
                loginSuccess : false,
                message : "이메일에 대한 유저가 존재하지 않습니다."
            })
        }
        // 요청된 이메일이 데이터베이스에 있다면. 비밀번호를 대조
        user.comparePassword(request.body.password,(err, isMatch)=>{
            if(err) throw err;
            if(!isMatch) return response.json({
                loginSuccess : false,
                message : "비밀번호가 틀립니다."
            });
            // 비밀번호가 맞다면 Token을 생성
            user.generateToken((err,user)=>{
                if(err) return response.status(400).send(err);
                // 토큰을 저장한다. 어디에 ?
                response.cookie("x_auth", user.token).status(200).json({
                    loginSuccess : true,
                    userId : user._id
                });
            });
        });
    });
})

// 인증
app.get("/api/users/auth", auth, (request, response)=>{
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    response.status(200).json({
        _id : request.user._id,
        isAdmin : request.user.role === 0 ? false : true,
        isAuth : true,
        email : request.user.email,
        name : request.user.name,
        lastname : request.user.lastname,
        role : request.user.role,
        image : request.user.image
    })
});

// 로그아웃
app.get("/api/users/logout", auth, (request, response)=>{
    User.findOneAndUpdate({ _id : request.user._id},{token : ""}, (err, user)=>{
        if(err) return response.json({
            success : false, err
        })
        return response.status(200).send({
            success : true
        })
    })
})

app.get("/api/hello", (request, response)=>{
    response.send("안녕하세요")
});


app.listen(port, () => {
    console.log(`http://localhost:${port}/...is running`);
});