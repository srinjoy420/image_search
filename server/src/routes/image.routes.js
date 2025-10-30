import {Router} from "express"
const imageroute=Router()
import { isloggedin } from "../middleware/auth.middleware.js"
import {getallImages, getImagebyName, UploadImage} from "../controller/image.controller.js"

imageroute.post("/upload",isloggedin,UploadImage)
imageroute.get("/getall",isloggedin,getallImages)
imageroute.get("/search",isloggedin,getImagebyName)



export default imageroute