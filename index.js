const express = require("express");
const app = express();
const port = 5000
const mongoose = require("./lib/mongodb");



app.get("/", (request, response)=>{
    response.send("Hellow Express");
});

app.listen(port, () => {
    console.log(`http://localhost:${port}/...is running`);
});