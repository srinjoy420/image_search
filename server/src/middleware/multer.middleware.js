import multer from "multer"
import { ApiError } from "../utils/Api_error.js";

const storage=multer.memoryStorage();

export const upload=multer({
    storage,
    limits:{
        fileSize:2*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("image/")){
            cb(null,true)
        }
        else {
            cb(new ApiError("only images are allowed",400),false)
        }
    }
})