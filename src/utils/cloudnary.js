import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs"  //fs is file system


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET})


const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
         const Response=await cloudinary.uploader.upload(localFilePath,{
          resource_type:"auto"
        })
        //file has been uploaded successfully
        // console.log("file has uploaded in cloudinary");
        // console.log(Response)
        fs.unlinkSync(localFilePath)  
        return Response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation get failed
        return null;
    }
}
export {uploadOnCloudinary}



 