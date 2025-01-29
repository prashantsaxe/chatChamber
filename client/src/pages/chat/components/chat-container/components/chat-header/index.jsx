import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

export const ChatHeader = () => {

    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    console.log("Inside Chat Header",selectedChatData);
    return (
        <div className=" h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
            <div className="flex items-center gap-5 w-full justify-between ">
                <div className="flex gap-3 items-center justify-center" >

                    <div className="w-12 h-12 relative">
                        {selectedChatType === "contact" ? (
                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                {selectedChatData.image ? (
                                    <AvatarImage
                                        src={selectedChatData.image}
                                        alt={`${selectedChatData.firstname || selectedChatData.username}'s avatar`}
                                        className="object-cover w-full h-full bg-black rounded-full"
                                        onError={(e) => (e.currentTarget.src = "/fallback-avatar.png")}
                                    />
                                ) : (
                                    <div
                                        className={` rounded-full uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center text-white ${getColor(selectedChatData.color)}`}
                                    >
                                        {selectedChatData.firstname
                                            ? selectedChatData.firstname.charAt(0)
                                            : selectedChatData.username.charAt(0)}
                                    </div>
                                )}
                            </Avatar>
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2d2e33] text-[#8417ff]">
                                #
                            </div>
                        )
                        }
                    </div>
                    <div className="text-gray-300">
                        {selectedChatType === "channel" && selectedChatData.name}
                        {selectedChatType === "contact" &&
                            (`${selectedChatData.firstname} ${selectedChatData.lastname}`) || selectedChatData.email}
                    </div>

                </div>
                <div className="flex gap-5 items-center justify-center " >
                    <button className="text-neutral-500 focus:outline-none focus:text-white trasition-all duration-300"
                        onClick={closeChat}>
                        <RiCloseFill className="text-3xl" />
                    </button>
                </div>
            </div>

        </div>
    )
}