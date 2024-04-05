const mongoose = require("mongoose");

require("dotenv").config();

const dbconnect = ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser : true,
        useUnifiedTopology: true,
    })
    .then(()=>{console.log("Db connection successful")})
    .catch((error)=>{
        console.log("Issues in Db connection");
        console.error(error);
        process.exit(1);

    });
};
module.exports = dbconnect;

