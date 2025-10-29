import jwt from "jsonwebtoken";
import { ApiError } from "../utils/Api_error.js";
import dotenv from "dotenv";

dotenv.config();

export const isloggedin = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        console.log("📄 Available cookies:", req.cookies);
        console.log("🎫 Access token:", token ? "Found" : "Not found");
        if (!token) {
            console.log(" No access token found");
            throw new ApiError("dont have any accesoken")


        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("✅ Token verified successfully");
        console.log("👤 User ID:", decoded._id);

        req.user = decoded;
        next();
    } catch (error) {
        console.log("❌ Authentication middleware error:", error.message);
        if (error.name === 'TokenExpiredError') {
            throw new ApiError("Your session is expired", 404)
        }
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError("the token is invalid")
        }
        throw new ApiError("something went wrong in middleware")

    }



}