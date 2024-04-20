   // link to http crash course
   // https://www.linkedin.com/posts/hiteshchoudhary_http-crash-course-notes-activity-7130464152002658304-52df?utm_source=share&utm_medium=member_desktop

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async()=>{
    try{
       const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
     console.log(`\n MongoDB connected!! DB Host ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("MONGODB CONNECTION ERROR:", error);
        process.exit(1)
    }
}

export default connectDB