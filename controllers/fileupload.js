const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

//localfileupload->handler function  : Ye basically client ke path se file ko fetch krke server ke path pr upload kr dega that it.
exports.localFileUpload = async (req, res)=>{
    try{
        //fetch file: documentation m likha h express fileupload wali
        const file = req.files.file;  //here the .file is a key which we use in postman 
        console.log("FILE AAGYI JEE: ", file);

        //vo server ka path jispe file ko store krna chahte h
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;    //dirname ka mtlb current directory i.e controllers folder
        console.log("Path: ", path);
        //move krna h file ko server pr
        file.mv(path, (err)=>{
            console.log(err);

        });
        res.json({
            success: true,
            message: "File uploaded successfully locally",
        });



    }
    catch(error){
        console.log(error);
    }
}


//Image upload->handler function

    // function to check file type supported 
function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

    //fie upload function to cludinary
async function uploadFileToCloudinary(file, folder, quality){
    const option = {folder};
    if(quality){
        option.quality = quality;
    }
    console.log("Temp file path: ", file.tempFilePath);   //temp file path hi h vo jo phle server pr file upload krta h phir server se cloudinary pr upload krta h. Uploading is a 3 step process.
    option.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, option);
}


exports.imageUpload = async (req, res)=>{
    try{
        //fetch data
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        //receive files
        const file = req.files.imageFile;
        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        //find the file type using split method
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File type:", fileType);
        //check file type
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message:"Invalid file format",
            })
        }

        //if file format supported than upload to cloudinary
        console.log("Uploading to FileUpload...");
        const response = await uploadFileToCloudinary(file, "FileUpload");
        console.log(response);
        //save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });


        res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image successfully uploaded",
        })
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong while uploading image",
        })
    }
};

//video upload 


exports.videoUpload = async (req, res)=>{
    try{
        //fetch data
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        //receive file
        const file = req.files.videoFile;

        //validation
        const supportedTypes = ["mp4", "mov"];
        //find the file type using split method
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File type:", fileType);
        //check file type  and uppler limit of 5MB video
        const fileSizeinMB = file.size/(1024*1024);
        console.log("Size of video is", fileSizeinMB);
        if(fileSizeinMB > 15){
            return res.status(400).json({
                success: false,
                message: "File size is greater than 15 MB",
            })
        }
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message:"Invalid file format",
            })
        }

        //if file format supported than upload to cloudinary
        console.log("Uploading to FileUpload...");
        const response = await uploadFileToCloudinary(file, "FileUpload");
        console.log(response);
        //save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });


        res.status(200).json({
            success: true,
            videoUrl: response.secure_url,
            message: "Video successfully uploaded",
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong while uploading video",

        })
    }
};



//imageSizeREducer

exports.imageSizeReducer = async(req, res)=>{
    try{
        //fetch data
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        //receive files
        const file = req.files.imageFile;
        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        //find the file type using split method
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File type:", fileType);
        //check file type
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message:"Invalid file format",
            })
        }


        //if file format supported than upload to cloudinary and add a quality parameter to the function
         console.log("Uploading to FileUpload...");
         const response = await uploadFileToCloudinary(file, "FileUpload", 10);
         console.log(response);
        //save entry in db
         const fileData = await File.create({
             name,
             tags,
             email,
             imageUrl: response.secure_url
         });
 
 
         res.status(200).json({
             success: true,
             imageUrl: response.secure_url,
             message: "Image successfully uploaded",
         })

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong while uploading image reduce",

        })
    }
};

