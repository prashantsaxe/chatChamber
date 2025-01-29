import { mongoose } from "mongoose";

const messageSchema = new mongoose.Schema({
    sender  : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required : true
    },
    recipient  : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required : false
    },

    messageType : {
        type : String,
        enum : ["text","file"],
        required : true,
    },
    content : {
        type : String,
        validate: {
            validator: function () {
                return this.messageType === "text" ? !!this.content : true;
            },
            message: "Content is required for text messages.",
        },
    },
    fileUrl : {
        type : String,
        validate: {
            validator: function () {
                return this.messageType === "file" ? !!this.fileUrl : true;
            },
            message: "File URL is required for file messages.",
        },
    },
    timeStamp : {
        type : Date,
        default : Date.now,
    },
})

const Message = mongoose.model("Messages",messageSchema);

export default Message;