import Image from "../models/image.model.js";
import cloudinary from "../libs/Cloudenary.js";
import User from "../models/User.model.js"

import { ApiError } from "../utils/Api_error.js";
import { ApiResponse } from "../utils/Api_response.js";

export const UploadImage = async (req, res) => {
    const { url, name } = req.body;
    if (!name) {
        throw new ApiError("image name is required", 400)
    }

    if (!url) {
        throw new ApiError("image url is required", 400)
    }

    const user = await User.findById(req.user._id)
    if (!user) {
        throw new ApiError("user not found", 404)
    }
    try {
        const uploadResponse = await cloudinary.uploader.upload(url,{
            folder: "uploads/images",
      resource_type: "image",
            
        });
        const newImage=await Image.create({
            url:uploadResponse.secure_url,
            name:name,
            addedby:user._id
        })

         const populatedImage = await newImage.populate("addedby", "name email");
        console.log(" Profile picture updated for user:", user._id);
        res.status(201).json(new ApiResponse(200,newImage,"image uploaded successfully"))
    } catch (error) {
        console.log("problem in uploading an image");
        throw new ApiError("failed to upload image",500)
        
    }
}
export const getallImages=async(req,res)=>{
 try {
       const user=await User.findById(req.user._id)
       if(!user){
        throw new ApiError("user not found",404)
       }
       const images=await Image.find().populate("addedby","name email")
   
       if(images.length===0){
           throw new ApiError("no images found",404)
       }
         res.status(200).json(new ApiResponse(200,images,"images fetched successfully"))
 } catch (error) {
    console.log("cant load the images",error);
    
    throw new ApiError("failed to fetch images",500)
    
 }
    
}
export const getImagebyName=async(req,res)=>{
 try {
       const {name}=req.query
       
    if (!name) {
      return res.status(200).json({ success: true, data: [] });
    }
          const images = await Image.find({
      name: { $regex: name, $options: "i" }, 
    }).limit(5);; 
   
       res.json({ success: true, data: images });
 } catch (error) {
    console.log("error in searching image by name",error);
    throw new ApiError("failed to fetch images",500)
 }

}