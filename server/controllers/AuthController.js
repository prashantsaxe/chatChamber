import { response } from "express";
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken";
import { renameSync, unlink, unlinkSync,existsSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import cloudinary from "../cloudinaryConfig.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({
        data: { email, userId },
    },
        process.env.JWT_KEY,
        {
            expiresIn: maxAge
        });
}
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
export const signup = async (req, res, next) => {
    try {

        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.status(400).send("email and password and username is required");

        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send("Email already in use");
        }

        // Check if the username already exists
        // const existingUsername = await User.findOne({ username });
        // if (existingUsername) {
        //     return res.status(400).send("Username already in use");
        // }
        const user = await User.create({ email, password, username });
        res.cookie("jwt", createToken(email, user.id), {
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profileSetup: user.profileSetup,

            }
        })


    } catch (error) {
        console.log({ error });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password is required");
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send("Invalid user");
        }
        const passwordCorrect = await existingUser.comparePassword(password);
        if (!passwordCorrect) {
            return res.status(400).send("Invalid credentials");
        }
        res.cookie("jwt", createToken(email, existingUser.id), {
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(201).json({
            user: {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                profileSetup: existingUser.profileSetup,
            }
        });
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

export const getuserinfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(400).send("User not found");
        }

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            profileSetup: userData.profileSetup,
            firstname: userData.firstname,
            lastname: userData.lastname,
            image: userData.image,
            color: userData.color,
        })


    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

export const updateprofile = async (req, res, next) => {
    try {
        const { userId } = req;
        console.log({ userId });

        const { firstname, lastname, color } = req.body;
        console.log({ firstname, lastname, color });
        if (!firstname || !lastname) {
            console.log("hit2");
            return res.status(400).send("All fields are required");

        }
        console.log("hit");
        const userData = await User.findByIdAndUpdate(
            userId, {
            firstname,
            lastname,
            color,
            profileSetup: true,
        }, {
            new: true,
            runValidators: true
        }
        );
        console.log({ userData });
        if (!userData) {
            return res.status(400).send("User not found");
        }

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            profileSetup: userData.profileSetup,
            firstname: userData.firstname,
            lastname: userData.lastname,
            image: userData.image,
            color: userData.color,
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}



export const addprofileimage = async (req, res) => {
    try {
        console.log("📌 Entered addprofileimage route");

        if (!req.body.image) {
            console.log("❌ No image received in request");
            return res.status(400).json({ error: "Profile image is required" });
        }

        console.log("📌 Uploading to Cloudinary...");
        
        const result = await cloudinary.uploader.upload(req.body.image, {
            folder: "uploads/profiles",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "webp"], // ✅ Allow only safe image formats
            transformation: [{ width: 500, height: 500, crop: "limit" }], // ✅ Resize to prevent huge images
        });
        

        console.log("✅ Cloudinary Upload Success:", result.secure_url);

        // Update user profile in database
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { image: result.secure_url }, // Save Cloudinary URL
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            console.log("❌ User not found in database");
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ image: result.secure_url });

    } catch (error) {
        console.error("❌ Upload Profile Image Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

  

export const deleteprofileimage = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || !user.image) return res.status(404).json({ error: "User or image not found" });
  
      // Extract Cloudinary public ID
      const publicId = user.image.split("/").pop().split(".")[0];
  
      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(`uploads/profiles/${publicId}`);
  
      // Remove image from database
      user.image = null;
      await user.save();
  
      return res.status(200).json({ message: "Profile image removed successfully" });
    } catch (error) {
      console.error("Delete Profile Image Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

export const logout = async (req, res, next) => {
    try {
         res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"});
         return res.status(200).send("Logged out successfully");
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}


