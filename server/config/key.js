const { request } = require("express");

if(process.env.NODE_ENV === 'production'){
    console.log("production_mode");
    module.exports = require("./prod");
} else {
    console.log("developer_mode");
    module.exports = require("./dev");
}