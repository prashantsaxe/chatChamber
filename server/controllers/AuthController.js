import { response } from "express";
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken";
import { renameSync, unlink, unlinkSync,existsSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send("Username already in use");
        }
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

export const addprofileimage = async (req, res, next) => {
    try {

        const date = Date.now();
        let filename = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, filename);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { image: filename },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            image: updatedUser.image,
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
};

export const deleteprofileimage = async (req, res, next) => {
    try {
        const { userId } = req;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("User not found");
        }
        console.log({ "user.image": user.image });
        if (user.image) {
            const imagePath = path.join(__dirname, '..', user.image);
            console.log("Image Path:", imagePath);
            if (existsSync(imagePath)) {
                unlinkSync(imagePath);
            } else {
                console.log("File does not exist:", imagePath);
            }
        }
        user.image = null;
        await user.save();
        return res.status(200).send("Profile Image Removed Successfully");
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

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


