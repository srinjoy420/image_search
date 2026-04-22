import Image from "../models/image.model.js";
import cloudinary from "../libs/Cloudenary.js";
import User from "../models/User.model.js"
import streamifier from "streamifier";

import { ApiError } from "../utils/Api_error.js";
import { ApiResponse } from "../utils/Api_response.js";




export const uploadImage=async(req,res)=>{
  try {
    const {name}=req.body
    if(!name){
      throw new ApiError("image name is required",400)
    }
    if(!req.file){
      throw new ApiError("image is required",400)
    }
    //Upload buffer to Cloudinary
    const streamUpload=()=>{
      return new Promise((resolve,reject)=>{
        const stream=cloudinary.uploader.upload_stream({
          folder:"uploads/images",
        },
        (error,result)=>{
          if(result){
            resolve(result)
          }
          else reject(error)
        }
      );
       streamifier.createReadStream(req.file.buffer).pipe(stream);
      })
    }
    const result =await streamUpload()
    const image=await Image.create({
      url:result.secure_url,
      name,
      addedby:req.user._id
    })
   const populateImage=await image.populate("addedby", "name email")
   res.status(201).json(new ApiResponse(201,populateImage,"image uploaded successfully"))
  } catch (error) {
    console.log("failed to upload image",error);
    throw new ApiError("failed to upload image",500)
    
    
  }
}

export const getallImages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      throw new ApiError("user not found", 404)
    }
    const images = await Image.find().populate("addedby", "name email")

    if (images.length === 0) {
      throw new ApiError("no images found", 404)
    }
    res.status(200).json(new ApiResponse(200, images, "images fetched successfully"))
  } catch (error) {
    console.log("cant load the images", error);

    throw new ApiError("failed to fetch images", 500)

  }

}
export const getImagebyName = async (req, res) => {
  try {
    const { name } = req.query

    if (!name) {
      return res.status(200).json({ success: true, data: [] });
    }
    const images = await Image.find({
      name: { $regex: name, $options: "i" },
    }).limit(5).populate("addedby", "name email");

    return res.json({ success: true, data: images });
  } catch (error) {
    console.log("error in searching image by name", error);
    throw new ApiError("failed to fetch images", 500)
  }

}