import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/user.controllers.js";
import {upload} from "../middlewears/multer.middlewear.js"
import { verifyJWT } from "../middlewears/auth.middlewear.js";
import { refrshAccessToken } from "../controllers/user.controllers.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser) 

router.route("/login").post(loginUser)
 // secured routes
    router.route("/logout").post(verifyJWT , logoutUser)
    router.route("/refresh-token").post(refrshAccessToken)    



export default router