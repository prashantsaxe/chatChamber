import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();
    // console.log("inside socket provider");
    // console.log("userInfo",userInfo);
    useEffect(() => {
        // console.log("inside UseEffect");
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {
                    userId: userInfo.id
                },
            });
            socket.current.on("connect", () => {
                // console.log("connected to socket server inside useEffect");
            });
            // console.log("after on")
            const handleReceiveMessage = (message) => {
                // console.log("inside handleReceiveMessage");
                const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();
                if (
                    selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id ||
                        selectedChatData._id === message.recipient._id)
                ) {
                    console.log("received message", message);
                    addMessage(message);
                }
            };
            
            socket.current.on("recieveMessage", handleReceiveMessage);

            return () => {
                socket.current.disconnect();
            };
        }
    }, [userInfo]);
    // console.log("after useEffect");
    return (
        
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};