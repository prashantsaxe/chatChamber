import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";


export const searchContacts = async (req, res, next) => {
    try {
        const {searchTerm} = req.body;
        if(searchTerm===undefined || searchTerm===null){
            return res.status(400).send("Search term is required");
        }
        // console.log("Search term:",searchTerm);
        const sanitizedSearchTerm = searchTerm.replace(
            /[/*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        { username: { $regex: regex } },
                        { firstname: { $regex: regex } },
                        { lastname: { $regex: regex } },
                        { email: { $regex: regex } }, 
                    ],
                },
            ],
        })
        // console.log("API response:", contacts);
        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

export const getContactsForDMList = async (req, res, next) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        // Debug log to verify the userId
        console.log("Processing userId:", userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                },
            },
            {
                $sort: { timeStamp: -1 },  // Changed from timestamp to timeStamp
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timeStamp" }  // Changed from timestamp to timeStamp
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstname: "$contactInfo.firstname",
                    lastname: "$contactInfo.lastname",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            },
        ]);

        console.log("Number of contacts found:", contacts.length);
        
        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

export const getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find({_id: {$ne : req.userId}},"firstname lastname _id");

        
        console.log(users);
        const contacts = users.map((user)=>({
            label: user.firstname? `${user.firstname} ${user.lastname}` : user.email,
            value: user._id,
        }))
        // console.log("API response:", contacts);
        return res.status(200).json({ contacts });
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}