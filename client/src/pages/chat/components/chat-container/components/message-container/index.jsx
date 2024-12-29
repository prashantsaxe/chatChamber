import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";
import { MdFolderZip } from "react-icons/md";
import {Download,X} from "lucide-react"
import axios from "axios";
import { useState } from "react";
export const MessageContainer = () => {
    const scrollRef = useRef();
    const { selectedChatType, selectedChatData, userInfo, selectedChatMessages , setSelectedChatMessages
        ,setIsDownloading,setFileDownloadProgress
    } = useAppStore();
    const [showImage , setShowImage] = useState(false);
    const [imageUrl , setImageUrl] = useState(null);
    useEffect(()=>{
        console.log("getMessages");
        
        const getMessages = async () => {     
            try{ 
                const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE,
                    {id:selectedChatData._id},
                    {withCredentials:true}
                );
                console.log("response here : ",{response});
                if(response.data.messages){
                    setSelectedChatMessages(response.data.messages);
                }
            }catch(error){
                console.log({error});
            }
        };
        if(selectedChatData._id){
            console.log("selectedChatType",selectedChatType);
            if(selectedChatType === "contact"){
                getMessages();
            }
        }
        console.log("selectedChatMessages",selectedChatMessages);
    },[selectedChatData,selectedChatType,setSelectedChatMessages]);
    
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages]);

    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|svg|ico|webp|heic|heif)$/i;
        return imageRegex.test(filePath);
    };

    const renderMessages = () => {
        let lastDate = null;

        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;

            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-xs text-gray-500 my-2">
                            {moment(message.timeStamp).format("LL")}
                        </div>
                    )}
                    {
                        selectedChatType === "contact" && renderDMMessages(message)
                    }
                </div>
            )
        })
    }

    const handleDownload = async (url) => {
        try {
            setIsDownloading(true);
            setFileDownloadProgress(0);
            const response = await axios.get(url, { responseType: "blob" ,
                onDownloadProgress : (data)=>{
                    setFileDownloadProgress(Math.round(100*data.loaded)/data.total)
                }
            }
            );
            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", url.split("/").pop()); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
            setIsDownloading(false);
            setFileDownloadProgress(0);
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    const renderDMMessages = (message) => {
        return (
        <div className={`${message.sender === selectedChatData._id ?
            "text-left" :
            "text-right"}`}>
            {message.messageType === "text" && (
                <div className={`${message.sender!== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} 
                border inline-block p-4 rounded my-1 max-w-[50%] break-words` }>
                {message.content}
                </div>
            )}
            {
                message.messageType === "file" && (<div className={`${message.sender!== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} 
                border inline-block p-4 rounded my-1 max-w-[50%] break-words` }>
                
                {checkIfImage(message.fileUrl) ?
                <div className="cursor-pointer"
                onClick={()=>{setShowImage(true);
                setImageUrl(message.fileUrl)}}>
                     <img src={`${HOST}${message.fileUrl}`} height={300} width={300}/>

                </div> 
                : <div className="items-center flex gap-4 justify-center">
                    <span className="text-white/80 rounded-full bg-black/20 text-3xl p-3">
                        <MdFolderZip />
                    </span>
                    <span>
                        {message.fileUrl.split("/").pop()}
                    </span>
                    <span className="bg-black/20 p-3 text-2xl rounded-full hovwer:bg-black/50 cursor-pointer transition-all duration-300" 
                    onClick={()=>{handleDownload(message.fileUrl)}}>
                        <Download className="text-2xl text-white/80" />
                    </span>
                </div>}

                </div>)
            }
            <div className="text-xs text-gray-600">
                {moment(message.timeStamp).format("LT")}
            </div>
        </div> )
    }

    return (
        <div className="flex-1 overflow-hidden scrollbar-hidden p-4 px-8  md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
            {renderMessages()}
            <div ref={scrollRef} />
            {showImage && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <img src={`${HOST}${imageUrl}`} alt="Preview" className="max-h-[80vh] w-full object-cover" />
                    <div className="fixed top-5  flex gap-5 items-center justify-center ">
                        <button
                            className="bg-gray-800 p-3 text-2xl rounded-full cursor-pointer transition-all duration-300"
                            onClick={() => handleDownload(imageUrl)}
                        >
                            <Download />
                        </button>
                        <button
                            className="bg-gray-800 p-3 text-2xl rounded-full cursor-pointer transition-all duration-300"
                            onClick={() => {
                                setShowImage(false);
                                setImageUrl(null);
                            }}
                        >
                            <X />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}