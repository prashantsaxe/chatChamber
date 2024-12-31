

import { Socket, Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModal.js";
const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        },
    })

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`User disconnected with id ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl,
        })
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstname lastname image color")
            .exec();
        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });
        const channel = await Channel.findById(channelId).populate("members");
        const finalData = { ...messageData._doc, channelId: channel._id };
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberScoketId = userSocketMap.get(member._id.toString());
                if (memberScoketId) {
                    io.to(memberScoketId).emit("recieve-channel-message", finalData);
                }
            })
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieve-channel-message", finalData);
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createMessage = await Message.create(message);

        const messageData = await Message.findById(createMessage._id)
            .populate("sender", "id email  firstname lastname image color")
            .populate("recipient", "id email  firstname lastname image color");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected with id ${userId} with socket id ${socket.id}`);
        } else {
            console.log("userId not found in socket handshake query");
        }

        socket.on("sendMessage", sendMessage)
        socket.on("send-channel-message", sendChannelMessage)
        socket.on("disconnect", () => { disconnect(socket) })
    })



}


export default setupSocket;