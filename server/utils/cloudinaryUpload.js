import cloudinary from "../cloudinaryConfig.js";

export const uploadFileToCloudinary = async (fileBase64, fileType) => {
    try {
        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: "uploads/messages",
            resource_type: "auto", // Auto-detects if it's an image, video, or document
            format: fileType, // Optional: Ensures the correct file format
        });

        return { url: result.secure_url, type: result.resource_type };
    } catch (error) {
        console.error("Cloudinary File Upload Error:", error);
        throw new Error("File upload failed");
    }
};
