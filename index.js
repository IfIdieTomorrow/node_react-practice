const express = require("express");
const app = express();
const port = 5000
const mongoose = require("./lib/mongodb");
const { User } = require("./model/User");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))

app.get("/", (request, response)=>{
    response.send("Hellow Express");
});

// 회원가입
app.post("/register", (request, response)=>{
    const user = new User(request.body);
    user.save((err, userInfo)=>{
        if(err) return response.json({success : false, err});
        return response.status(200).json({
            success : true
        })
    });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}/...is running`);
});