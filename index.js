//app create
const express = require("express");
const app = express();


//port find
require("dotenv").config();
const PORT = process.env.PORT || 3000;

//middlewre find
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload(
   {
    useTempFiles : true,
    tempFileDir : '/tmp/'
   }
));


//coonnecst with db
const dbconnect = require("./config/database");
dbconnect();


//connect with cluodu
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//api mounting
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);


//activate server
app.listen(PORT, ()=>{
    console.log(`App is running at port ${PORT}`);
})


