import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import animationData from "@/assets/lottie-json";
import Lottie from "lottie-react";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store";

const NewDm = () => {
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const {setSelectedChatData,setSelectedChatType } = useAppStore();
    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
    }

    const searchContact = async (searchTerm) => {
        try {
            // console.log("Search term:",searchTerm); // Log the search term
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { searchTerm },
                    { withCredentials: true }
                );
                // console.log("API response:", response); // Log the API response
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                }
            } else {
                setSearchedContacts([]);
            }
        } catch (error) {
            console.error("Error searching contacts:", error);
        }
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger aria-label="Add new contact">
                        <FaPlus
                            className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-2 text-white">
                        <p>Select New Contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select a contact</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <div>
                        <input
                            placeholder="Search Contact"
                            className="rounded-lg p-4 bg-[#2c2e3b] border-none w-full"
                            onChange={(e) => searchContact(e.target.value)}
                        />
                    </div>
                    {searchedContacts.length>0 && (<ScrollArea className="h-[250px]">
                        <div className="flex flex-col gap-5">
                            {searchedContacts.map((contact) => (
                                <div key={contact._id} className="flex gap-3 items-center cursor-pointer"
                                    onClick={() => selectNewContact(contact)}>
                                    <div className="w-12 h-12 relative">
                                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                        {contact.image ? (
                                            <AvatarImage
                                                src={contact.image}
                                                alt={`${contact.firstname || contact.username}'s avatar`}
                                                className="object-cover w-full h-full bg-black "
                                                onError={(e) => (e.currentTarget.src = "/fallback-avatar.png")}
                                            />
                                        ) : (
                                            <div
                                                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center text-white ${getColor(contact.color)}`}
                                            >
                                                {contact.firstname
                                                    ? contact.firstname.charAt(0)
                                                    : contact.username.charAt(0)}
                                            </div>
                                        )}
                                    </Avatar>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>
                                            {contact.firstname && contact.lastname
                                                ? `${contact.firstname} ${contact.lastname}`
                                                : contact.username}
                                        </span>
                                        <span className="text-xs">{contact.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>)
                    }
                    {searchedContacts.length <= 0 && (
                        <div className="flex-1 md:flex flex-col justify-center items-center duration-1000 mt-5 lg:mt-0 h-full transiton-all">
                            <Lottie
                                animationData={animationData}
                                loop
                                autoplay
                                style={{ height: 100, width: 100 }}
                            />
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                                <h3 className="poppins-medium bold">
                                    Hi
                                    <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-sunset">
                                        !
                                    </span>{" "}
                                    Search Contacts
                                    <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-sunset">
                                        Here
                                    </span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NewDm;
