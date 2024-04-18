import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoesSchema = new Schema({
    videoFile:{
        type: String,//cloudnary url
        required:true
    },
    thumbnail:{
        type: String,//cloudnary url
        required:true
    },
    Title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    duration:{
        type: Number, 
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    Owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})




videoesSchema.plugin(mongooseAggregatePaginate)


export const  Video = mongoose.model('Video',videoesSchema) 
// bcrypt hashes the password 