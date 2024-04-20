import {asyncHandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/apierror.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiresponse.js";
const registerUser = asyncHandler(async(req , res)=>{
   // user details
   // validation - not epmty
   // chechk if user is already registered or not
   // check for images , check for  avatar
   // upload them to cloudinary
   // create user object - create entry in DB
   // remove password and refresf token from  respomse
   // check for user creation
   // return res


      const {fullname , email ,password , username}= req.body
    console.log("email:",email);

    // if(fullname===""){
    //     throw new  ApiError(400,"fullname is required")
    // }
    if(
        [fullname,email,password,username].some((field)=>field?.trim() === "")
    )
    {
        throw new ApiError(400,"all fields are required")
    }   
const existedUserUser = await User.findOne({
    $or: [{username} , {email}]
})

if(existedUserUser){
    throw new ApiError(409 ,"User with email or Username already")
}

const avatarLocalPath=req.files?.avatar[0]?.path // remember the way of getting image from multer 
 const coverImageLocalPath=req.files?.coverImage[0]?.path

if (!avatarLocalPath) {
    throw new ApiError(400,"avatar is required")
}

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar is required")
    }
    
     const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "" ,// because coverImage may have may not have
        email,
        password,
        username : username.toLowerCase()
    })

     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )

     if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
     }


     return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
     )


})


export default registerUser

