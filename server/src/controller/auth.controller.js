import User from "../models/User.model.js";
import { ApiError } from "../utils/Api_error.js";
import { ApiResponse } from "../utils/Api_response.js";
import jwt from "jsonwebtoken";


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production (with https)
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError("User not found", 400);
        }

        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Generate Access and Refresh Token Error: ", error);
        throw new ApiError("Internal Server Down", 500);
    }
};

export const singUp = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new ApiError("all field are required", 400)
    }

    try {
        const existUser = await User.findOne({ email })

        if (existUser) {
            throw new ApiError("user already exist", 400)


        }
        const user = await User.create({ name, email, password })

        const tokens = await generateAccessAndRefreshToken(user._id);

        res.cookie("accessToken", tokens.accessToken, cookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,

        };

        console.log("✅ User registered successfully:", userResponse.id);

        res.status(201).json(new ApiResponse(201, { user: userResponse }, "User registered successfully"));


    } catch (error) {
        console.log("error in siningup", error);
        throw new ApiError("cant login", 400)


    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        throw new ApiError("all field are required", 400)
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError("cant find the user", 400)

        }
        const isPasswordCorrect = await user.ispasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError("password canrt match", 400)

        }
        const tokens = await generateAccessAndRefreshToken(user._id);
        res.cookie("accessToken", tokens.accessToken, cookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,

        };
        console.log("✅ User registered successfully:", userResponse.id);

        res.status(201).json(new ApiResponse(201, { user: userResponse }, "User registered successfully"));

    } catch (error) {
        console.log("error in login", error);
        throw new ApiError("cant login", 400)


    }
}

export const logout = async (req, res) => {
    try {
        const cookieNames = ["accessToken", "refreshToken",];
        cookieNames.forEach(cookieName => {
            res.clearCookie(cookieName, {
                ...cookieOptions,
                path: "/",
            });
        })

        if (req.user && req.user._id) {
            try {
                await User.findByIdAndUpdate(
                    req.user._id,
                    { $unset: { refreshToken: 1 } },
                    { new: true }
                );
                console.log("✅ Refresh token cleared from database for user:", req.user._id);
            } catch (error) {
                console.error(" Error clearing refresh token from database:", error);
            }
        }
        console.log(" User logged out successfully");
         res.status(201).json(new ApiResponse(201,  "User loggedot successfully"));
    }
    catch (error) {
        console.log("failour in logout",error);
        throw new ApiError("userer loggegout failed",400)
        

    }
}