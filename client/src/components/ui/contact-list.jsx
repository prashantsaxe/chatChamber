import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {

    const { selectedChatData, selectedChatType, setSelectedChatData, setSelectedChatType, setSelectedChatMessages } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) {
            setSelectedChatType("channel");
        }
        else {
            setSelectedChatType("contact");
        }
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    };

    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                <div
                    key={contact._id} className={`pl-10 py-2 transition-all duration-100 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-yellow-600 text-white" : "text-gray-500 hover:bg-[#2d2e33]"}`}
                    onClick={() => handleClick(contact)}>
                    <div className=" flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !isChannel && (<Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {contact.image ? (
                                    <AvatarImage
                                        src={`${HOST}${contact.image}`}
                                        alt={`${contact.firstname || contact.username}'s avatar`}
                                        className="object-cover w-full h-full bg-black"
                                        onError={(e) => (e.currentTarget.src = "/fallback-avatar.png")}
                                    />
                                ) : (
                                    <div
                                        className={` ${selectedChatData && selectedChatData._id === contact._id?
                                        "bg-[#ffffff22] border-2 border-white/70 " :getColor(contact.color) }  uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center text-white rounded-full }`}
                                    >
                                        {contact.firstname
                                            ? contact.firstname.charAt(0)
                                            : contact.username.charAt(0)}
                                    </div>
                                )}
                            </Avatar>)
                        }
                        {
                            isChannel && (
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2d2e33] text-[#8417ff]">
                                    #
                                </div>
                            )
                        }
                        {
                            isChannel ? contact.name : `${contact.firstname} ${contact.lastname}`
                        }
                    </div>
                </div>
            ))}

        </div>
    )

}

export default ContactList;