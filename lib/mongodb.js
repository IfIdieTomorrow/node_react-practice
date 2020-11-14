const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://IfIdie:mongoadmin@my-cluster.bu7ku.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
}).then(()=>console.log("MongoDb Connected...")).catch((err)=>{
    console.log(err);
})

module.exports = mongoose;
