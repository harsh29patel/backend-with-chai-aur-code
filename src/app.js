import express from "express";
import cors from "cors"
import cookieParser from 'cookie-parser';

const app =  express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit :"16kb"}))
app.use(express.urlencoded({extended:true ,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import

import userRouter from './routes/user.routes.js';


// rotes decalaration
 app.use("/api/v1/users",userRouter)     // when any user types /users userRouter will get control

export{ app }