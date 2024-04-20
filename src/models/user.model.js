import mongoose, {Schema} from "mongoose";
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"   //jwt is an bearer token means if someone send this token we give them access

const userSchema = new  Schema({
    username:{
        type: String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
        index:true  // to enable searching field in optimize way
    },
    
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required:true,
        trim: true,
        index: true
    },
    avatar:{
        type:String,  //cloudnary url
        required:true,
    },
    coverImage:{
        type:String     //cloudnary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true , 'Password is required']
    },
    refreshToken:{
        type: String
    }
},{timestamps:true})



userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();  // look at  syntax
    this.password = await bcrypt.hash(this.password,10)  //number for how many rounds
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password,this.password)
}

userSchema.method.generateAccessToken=function(){      // arrow function method is bit complex use this method
   return jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
}
)
}
userSchema.method.generateReferenceToken=function(){
    return jwt.sign({
        _id: this._id
    },
process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
}
)
}

export const User = mongoose.model("User",userSchema)