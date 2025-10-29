import {Router} from "express"

import {login, singUp,logout} from "../controller/auth.controller.js"
import { isloggedin } from "../middleware/auth.middleware.js"


const authroute=Router()

authroute.post("/signup",singUp)
authroute.post("/login",login)
authroute.get("/logout",isloggedin,logout)

export default authroute