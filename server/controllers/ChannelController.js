import mongoose from "mongoose";
import Channel from "../models/ChannelModal.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res, next) => {
    try {
        const {name, members} = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);

        if(!admin){
            return response.status(400).send("Admin User Not Found");
        }

        const validMembers =  await User.find({_id : {$in : members}});

        if(validMembers.length !== members.length){
            return res.status(400).send("Some Members are not valid");
        }

        const newChannel = new Channel({
            name,
            members,
            admin : userId,
        })
        await newChannel.save();

        return res.status(201).json({channel : newChannel});

    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserChannels = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find(
            {
                $or : [{members : userId},{admin : userId}],
            }
        ).sort({updatedAt : -1});
        
        return res.status(201).json({channels});

    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}

export const getChannelMessages = async (req, res, next) => {
    try {
        const {channelId} = req.params;
        const channel = await Channel.findById(channelId).populate({
            path : "messages",
            populate : {
                path : "sender",
                select : "firstname lastname email _id image color",
            },
        });
        if(!channel){
            return res.status(404).send("Channel Not Found");
        }
        const messages = channel.messages;
        // console.log({messages});
        return res.status(201).json({messages});
    }
    catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}