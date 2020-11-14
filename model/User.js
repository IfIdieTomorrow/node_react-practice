const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim: true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
});

UserSchema.pre('save', function(next){
    const user = this;

    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err2, hash){
                if(err2) return next(err2);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function(plainPassword, cb){
    
    // plainPassword 암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });

}

UserSchema.methods.generateToken = function(cb){
    let user = this;
    // jsonwebtoken을 사용하여 token생성
    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });
};

UserSchema.static.findByToken = function(token, cb){
    let user = this;

    // 토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용하여 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({
            "_id" : decoded,
            "token" : token
        },function(err, user){
            if(err) return cb(err);
            cb(null, user);
        });
    });
}


const User = mongoose.model('User',UserSchema);

module.exports = {User};