import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerFill } from "react-icons/ri";
import { Send } from "lucide-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";


export const MessageBar = () => {
    const socket = useSocket();
    const emojiRef = useRef(null);
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const {selectedChatType,selectedChatData,userInfo} = useAppStore();
    useEffect(()=>{
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown",handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown",handleClickOutside);
        }
    },[emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    }
    const handleSendMessage = async () => {
        console.log(selectedChatType)
        console.log(selectedChatData)
        if(selectedChatType==="contact"){
            console.log("sending message to contact")
            socket.emit("sendMessage",{
                sender : userInfo.id,
                content : message,
                recipient : selectedChatData._id,
                messageType : "text",
                fileUrl : undefined,

            });
            console.log(userInfo.id,message,selectedChatData._id)
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

                <button className="text-neutral-500 focus:outline-none focus:text-white duration-300 trasition-all ">
                    <GrAttachment className="text-2xl" />
                </button>
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
