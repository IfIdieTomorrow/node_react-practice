const mongoose = require("mongoose");
const config = require("../config/key");
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
}).then(()=>console.log("MongoDb Connected...")).catch((err)=>{
    console.log(err);
})

module.exports = mongoose;
