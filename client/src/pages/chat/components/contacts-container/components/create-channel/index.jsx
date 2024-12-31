import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiselect";

const CreateChannel = () => {
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const {setSelectedChatData,setSelectedChatType,addChannel } = useAppStore();
    const [allContacts,setAllContacts] = useState([]); 
    const [selectedContacts,setSelectedContacts] = useState([]);
    const [channelName,setChannelName] = useState("");
    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
    }
    useEffect(()=>{
        const getData = async()=>{
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE,{withCredentials:true});
            setAllContacts(response.data.contacts);
            console.log("response",response);
        }

        getData();
    },[])
    

    const createChannel = async()=>{
        try{
            const response = await apiClient.post(CREATE_CHANNEL_ROUTE,{
                name : channelName,
                members : selectedContacts.map((contact)=>contact.value)
            },{withCredentials:true});

            if(response.status === 201){
                setChannelName("");
                setSelectedContacts([]);
                setNewChannelModal(false);
                addChannel(response.data.channel);
                
            }

        } catch(error){
            console.log({error});
        }
    }
    // console.log(allContacts);
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger aria-label="Add new contact">
                        <FaPlus
                            className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-2 text-white">
                        <p>Create New Channel</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please Fill up the details for new Channel</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <div>
                        <input
                            placeholder="Channel Name"
                            className="rounded-lg p-4 bg-[#2c2e3b] border-none w-full"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    
                    <div>
                        <MultipleSelector className="rounded-lg bg-black/20 border-none p-4 text-white/80"
                            defaultOptions={allContacts}
                            placeholder="Select Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-gray-600 text-lg">No Result Found</p>
                            }
                        />
                    </div>
                    <div>
                        <Button className= " w-full bg-yellow-700 hover:bg-orange-700  transition-all duration-300  "
                            onClick={createChannel}
                        >
                            Create Channel
                        </Button>
                    </div>
                   
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChannel;
