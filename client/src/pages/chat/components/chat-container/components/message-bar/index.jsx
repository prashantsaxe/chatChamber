import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerFill } from "react-icons/ri";
import { Send } from "lucide-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";


export const MessageBar = () => {
    const socket = useSocket();
    const emojiRef = useRef(null);
    const fileInputRef = useRef();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const { selectedChatType, selectedChatData, userInfo ,setIsUploading,setFileUploadProgress} = useAppStore();
    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    }

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSendMessage = async () => {
        // console.log(selectedChatType)
        // console.log(selectedChatData)
        if (selectedChatType === "contact") {
            console.log("sending message to contact")
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,

            });
            // console.log(userInfo.id, message, selectedChatData._id)
        }
        else if(selectedChatType==="channel"){
            socket.emit("send-channel-message", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId : selectedChatData._id, 
            });
        }
        setMessage("");
    }

    const handleAttachmentChange = async (e) => {
        try {
            const file = e.target.files[0];
            console.log({ file });
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, { withCredentials: true ,
                    onUploadProgress : (data)=>{
                        setFileUploadProgress(Math.round(100*data.loaded)/data.total)
                    }
                });

                if (response.status === 200 && response.data ) {

                    if (selectedChatType === "contact") {
                        setIsUploading(false);
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath,

                        });
                    } else if(selectedChatType==="channel"){
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId : selectedChatData._id, 
                        });
                    }
                }
            }

        } catch (error) {
            setIsUploading(false);
            console.log({ error });
        }
    }

    return (
        <div className="flex justify-center items-center  h-[10vh] bg-[#1c1d25] px-8 mb-6 gap-6 ">

            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" placeholder="Enter Message"
                    value={message}
                    onChange={(e) => { setMessage(e.target.value) }} />

                <button className="text-neutral-500 focus:outline-none focus:text-white duration-300 trasition-all "
                    onClick={handleAttachmentClick}>
                    <GrAttachment className="text-2xl" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleAttachmentChange} className="hidden" />
                <div className="relative" >
                    <button className="text-neutral-500 focus:outline-none focus:text-white duration-300 trasition-all "
                        onClick={() => setEmojiPickerOpen(true)}>
                        <RiEmojiStickerFill className="text-3xl" />
                    </button>

                    <div className="absolute bottom-full right-0 mb-2" ref={emojiRef}>
                        <div className="shadow-lg">
                            <EmojiPicker
                                theme="dark"
                                open={emojiPickerOpen}
                                onEmojiClick={handleAddEmoji}
                                autoFocusSearch={false}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <button className="bg-amber-600 rounded-md flex items-center justify-center p-5 text-slate-200 hover:bg-orange-600 focus:outline-none focus:bg-orange-700 focus:text-white duration-300"
                onClick={handleSendMessage}>
                <Send className="h-6 w-6 " />
            </button>
        </div>
    )
}
