import {Router} from "express"
const imageroute=Router()
import { isloggedin } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

import {getallImages, getImagebyName, uploadImage} from "../controller/image.controller.js"


imageroute.post("/upload",isloggedin,upload.single("image"),uploadImage)
imageroute.get("/getall",isloggedin,getallImages)
imageroute.get("/search",isloggedin,getImagebyName)



export default imageroute