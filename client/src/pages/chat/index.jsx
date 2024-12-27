import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container/index.jsx";
import ContactsContainer from "./components/contacts-container/index.jsx";
import EmptyChatContainer from "./components/empty-chat-container/index.jsx";

const Chat = () => {
    const {userInfo , selectedChatType} = useAppStore();
    const navigate = useNavigate();
    // console.log("chat.jsx",{userInfo});
    useEffect(()=>{
        if(!userInfo.profileSetup){
            toast("Please complete your profile setup first");
            navigate("/profile");
        }
    },[userInfo,navigate]); 

    return (
        <div className="flex h-[100vh] text-white overflow-hidden "> 
            <ContactsContainer />
            {selectedChatType==undefined?
            (<EmptyChatContainer />)
            : (<ChatContainer />) }
            {/* <EmptyChatContainer /> */}
            {/* <ChatContainer /> */}
        </div>
    )
}
export default Chat;