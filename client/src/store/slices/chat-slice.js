
export const createChatSlice = (set,get)=>({
    selectedChatType : undefined,
    selectedChatData : undefined,
    selectedChatMessages : [],
    directMessagesContacts : [],
    setSelectedChatType : (selectedChatType)=>set({selectedChatType}),
    setSelectedChatData : (selectedChatData)=>set({selectedChatData}),
    setSelectedChatMessages : (selectedChatMessages)=>set({selectedChatMessages}),
    setDirectMessagesContacts : (directMessagesContacts)=>set({directMessagesContacts}),
    closeChat : ()=>{
        set({
            selectedChatData : undefined,
            selectedChatType : undefined,
            selectedChatMessages : [],
        })
    },
    addMessage : (message)=>{
        const selectedChatType = get().selectedChatType;
        const selectedChatData = get().selectedChatData;
        const selectedChatMessages = get().selectedChatMessages;
        set({
            selectedChatMessages : [
                ...selectedChatMessages,{
                    ...message,
                    recipient : 
                    selectedChatType==="channel" ? message.recipient : message.recipient._id,
                    sender : 
                    selectedChatType==="channel" ? message.sender : message.sender._id,
                },
            ],
        })
    },
})