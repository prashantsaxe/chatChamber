import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads/profiles", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "image", // Ensures it handles images properly
    public_id: (req, file) => `${Date.now()}-${file.originalname}` // Unique filename
  },
});

const upload = multer({ storage });

export default upload;
