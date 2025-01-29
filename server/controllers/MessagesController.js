import Message from "../models/MessagesModel.js";
import User from "../models/UserModel.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryUpload.js";

import {mkdirSync,renameSync} from "fs"

export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if(!user1 || !user2){
            return res.status(400).send("Search term is required");
        }
        
        const messages = await Message.find({
            $or : [
                {sender : user1,recipient   : user2},
                {sender : user2,recipient   : user1},
            ],
        }).sort({ timeStamp : 1 });

       
        return res.status(200).json({ messages });
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

export const uploadFile = async (req, res) => {
    try {
        console.log("📌 Entered uploadFile route");
        console.log("🔍 Received Body:", req.body);

        if (!req.body.file) {
            console.log("❌ No file received in request");
            return res.status(400).json({ error: "File is required" });
        }

        console.log("📌 Uploading file to Cloudinary...");

        // Upload file to Cloudinary
        const { url, type } = await uploadFileToCloudinary(req.body.file, req.body.fileType);

        console.log("✅ File uploaded to Cloudinary:", url);

        console.log("🔍 messageType received:", req.body.messageType);

        // Ensure messageType is set
        const messageType = req.body.messageType || "file"; // ✅ Default to "file"
        console.log("✅ Final messageType:", messageType);

        // ✅ Ensure `content` is only required for text messages
        const content = messageType === "text" ? req.body.content : undefined;

        // ✅ Ensure `fileUrl` is set correctly for file messages
        const fileUrl = messageType === "file" ? url : undefined;

        console.log("📌 Creating message in DB...");
        console.log({
            sender: req.userId,
            receiver: req.body.receiverId,
            messageType,
            content,
            fileUrl,
        });

        // ✅ Save message in MongoDB
        const newMessage = await Message.create({
            sender: req.userId,
            recipient: req.body.receiverId,
            messageType,
            content,
            fileUrl,
        });

        console.log("✅ Message saved:", newMessage);

        return res.status(200).json({ fileUrl: url, messageType, newMessage });
    } catch (error) {
        console.error("❌ Upload File Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
