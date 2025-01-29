import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerFill } from "react-icons/ri";
import { Send } from "lucide-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";


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
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };


    const handleAttachmentChange = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
    
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert to Base64
            reader.onloadend = async () => {
                const base64File = reader.result;
                const fileType = file.type.split("/")[1]; // Extract file extension
    
                try {
                    const response = await apiClient.post(
                        "/api/messages/upload-file",
                        {
                            file: base64File,  // ✅ Sends Base64 file data
                            fileType: fileType, // ✅ Sends file type
                            messageType: "file", // ✅ Required for backend validation
                            content: "", // ✅ Fix: Ensures empty content for file messages
                            receiverId: selectedChatData._id,
                        },
                        { withCredentials: true }
                    );
    
                    if (response.status === 200 && response.data.fileUrl) {
                        console.log("✅ File Uploaded Successfully:", response.data);
                        toast.success("File sent successfully");
    
                        // Send message via socket if the file is uploaded
                        const messagePayload = {
                            sender: userInfo.id,
                            messageType: "file",
                            fileUrl: response.data.fileUrl,
                            content: "", // ✅ Ensures empty content field
                        };
    
                        if (selectedChatType === "contact") {
                            socket.emit("sendMessage", {
                                ...messagePayload,
                                recipient: selectedChatData._id,
                            });
                        } else if (selectedChatType === "channel") {
                            socket.emit("send-channel-message", {
                                ...messagePayload,
                                channelId: selectedChatData._id,
                            });
                        }
                    }
                } catch (error) {
                    console.error("❌ File Upload Error:", error);
                    toast.error("Failed to send file");
                }
            };
        } catch (error) {
            console.error("❌ File Selection Error:", error);
        }
    };
    
    
    

    return (
        <div className="flex justify-center items-center  h-[10vh] bg-[#1c1d25] px-8 mb-6 gap-6 ">

            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" 
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => { setMessage(e.target.value) }}
                    onKeyDown={handleKeyDown} />
                    

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
