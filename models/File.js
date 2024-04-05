const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const fileSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    imageUrl:{
        type: String,
    },
    tags:{
        type: String,
    },
    email:{
        type: String,
    }

})

//Pre and Post middleware yahana pr define honge. before mongoose.model. 
//Email Sender after successfully creation of db
fileSchema.post("save", async function(doc){
    try{
        console.log("Doc", doc);   //ye doc vhi h jo database m entry create hui pdi hui h

        //create your trnasporter using nodemailer
        //Todo: Shift this configuaration under /config folder
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
        
        //mail send
        let info = await transporter.sendMail({
            from: "Gaurav Chakrawarti",
            to: doc.email,
            subject: "New File Uploaded on Cloudinary",
            html: `<h2>Hello Jii Hello Jii!</h2> <p> Your file has been successfully uploaded on Cloudinary</p> View here: <a href = ${doc.imageUrl}>${doc.imageUrl}</a> `
        })
        console.log("Info is: ",info);

    }catch(error){
        console.log(error);

    }
});

const File = mongoose.model("File", fileSchema);
module.exports = File;