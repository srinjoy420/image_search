import mongoose, { Schema } from "mongoose";
const imageSchema=new Schema({
    url:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        lowercase: true,
        trim: true
    },
    addedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       
    }

},{timestamps:true})

const Image=mongoose.model("Image",imageSchema)
export default Image;