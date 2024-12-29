import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container/index.jsx";
import ContactsContainer from "./components/contacts-container/index.jsx";
import EmptyChatContainer from "./components/empty-chat-container/index.jsx";

const Chat = () => {
    const {userInfo , selectedChatType,isUploading,
    isDownloading ,
    fileUploadProgress,
    fileDownloadProgress} = useAppStore();
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

            { isUploading &&(
                <div className=" h[100vh] w-[100wh] fixed top-0 left-0 bg-black/80 flex items-center flex-col gap-5 backdrop-blur-lg "  >
                <h5 className="text-5xl  animate-pulse">Uploading Files</h5>
                {fileUploadProgress}%
                </div>)
            }{ isDownloading &&(
                <div className=" h[100vh] w-[100wh] fixed top-0 left-0 bg-black/80 flex items-center flex-col gap-5 backdrop-blur-lg "  >
                <h5 className="text-5xl  animate-pulse">downloading Files</h5>
                {fileDownloadProgress}%
                </div>)
            }
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