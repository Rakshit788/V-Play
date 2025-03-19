import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { configDotenv } from "dotenv";
configDotenv()   ; 


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME , 
    api_key: process.env.CLOUD_API_KEY , 
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        console.log("file reached");
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file uploaded");
      
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("error"   ,  error);
        
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export default  uploadOnCloudinary