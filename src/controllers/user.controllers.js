import {asyncHandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/apierror.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiresponse.js";
import jwt from JsonWebTokenError;
import cookieParser from "cookie-parser";
import { json } from "express";
import mongoose from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(userId) =>{
  try {
    const user = await User.findById(userId)
        const accessToken =   user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()
         user.refreshToken = refreshToken
    await user.save({  ValidateBeforeSave :  false})
    return { accessToken , refreshToken}
}    catch (error) {
    throw new ApiError(500 , "Something went wrong while generating refresh and access token")
  }
}
const registerUser = asyncHandler(async (req , res)=>{
   // user details
   // validation - not epmty
   // chechk if user is already registered or not
   // check for images , check for  avatar
   // upload them to cloudinary
   // create user object - create entry in DB
   // remove password and refresf token from  respomse
   // check for user creation
   // return res


      const {fullname , email ,password , username}= req.body  // user details
    // console.log("email:",email);
    // console.log(req.body);  //just for knowledge

    // if(fullname===""){
    //     throw new  ApiError(400,"fullname is required")
    // }
    if(
        [fullname,email,password,username].some((field)=>field?.trim() === "") // validation
    )
    {
        throw new ApiError(400,"all fields are required")
    }   
const existedUserUser = await User.findOne({    //check if user is already registered or not
    $or: [{username} , {email}]
})

if(existedUserUser){
    throw new ApiError(409 ,"User with email or Username already")
}

 const avatarLocalPath=req.files?.avatar[0]?.path // remember the way of getting image from multer 
//  const coverImageLocalPath=req.files?.coverImage[0]?.path;
 let coverImageLocalPath;
 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
 }

//  console.log(req.files); // just for knowledge

if (!avatarLocalPath) {                             //chechk avatar image
    throw new ApiError(400,"avatar is required")
}

    const avatar = await uploadOnCloudinary(avatarLocalPath)      // upload in cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar is required")
    } 
    
     const user = await User.create({     // create user object
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // because coverImage may have may not have
        email,
        password,
        username : username.toLowerCase()
    })

     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"     // remove password and refresh token
     )

     if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")   // chechking for user creation
     }


     return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")  // return response
     )


})
 
const loginUser = asyncHandler(async (req, res) =>{
   
    // req body-> data
   // username or email is there or not
   //find the user
   //password check
   //access and refresh token send to user
   //send cookie 
   // send response


    const {email , username , password} = req.body
    console.log(email);
    
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

     // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

      const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken")// optional steps
    console.log(loggedInUser);

    const options = {
        httpOnly:true,
        secure:true
    }

    return  res.status(200).cookie("accessToken" , accessToken , options).cookie("refreshToken" , refreshToken , options).json(
        new ApiResponse(
            200,
        {
            user: loggedInUser , accessToken , refreshToken
        },
        "User logged in successfully"
    ) 
     
    )

})

 const logoutUser = asyncHandler(async(req,res)=>{
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,{},"user LoggedOut"))
 })
  // access token refreshing
 const refrshAccessToken = asyncHandler(async(req,res)=>{
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(incomingRefreshToken){
        throw new ApiError(401 , "unauthorized request")
    }
  try {
        const decodedToken =   jwt.verify(
              incomingRefreshToken,
              process.env.REFRESH_TOKEN_SECRET
          )
  
  
           const user = await User.findById(decodedToken?._id)   // ? = optionaly unwrapped karke id nikalo
           if(!user){
              throw new ApiError(401 , "invalid refresh token")
          }
          if(incomingRefreshToken !== user?.refreshToken )  // chechking if it is correct the one with user and with database
              {
                  throw new ApiError(401 ,"Refresh token is expired or used")
              }
     
              const options = {
                  httpOnly:  true,
                  secure:true
              }
  
          const{ accessToken , newrefreshToken} =  await generateAccessAndRefreshTokens(user._id)
  
              return res.status(200)
              .cookie("accessToken" ,accessToken , options)
              .cookie("refreshToken" , refreshToken , options)
              .json(
                  new ApiResponse(
                      200,
                      {
                          accessToken,
                          refrshToken: newrefreshToken},
                          "AccessToken refreshed successfully"
                      
                  )
              )
  } catch (error) {
    throw new ApiError(401 ,"Invalid refrsh token")
  }
    })

export {   registerUser,
            loginUser,
            logoutUser,
            refrshAccessToken
}

