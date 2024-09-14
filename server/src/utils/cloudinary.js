import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        await fs.promises.unlink(localFilePath); // Use async unlink
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        if (localFilePath) await fs.promises.unlink(localFilePath); // Ensure local file is deleted
        return null;
    }
};




export {uploadOnCloudinary}