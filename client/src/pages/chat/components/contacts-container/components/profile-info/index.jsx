import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";
import { getColor } from "@/lib/utils";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoPowerSharp } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();

    console.log(userInfo);

    const logOut = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
            if (response.status === 200) {
                setUserInfo(null);
                navigate("/auth");
            }
        } catch (error) {
            console.error(error);
        }
    };
    if(!userInfo.color) return <div>Loading...</div>;

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-5 gap-2 w-full bg-[#2a2b33]">
            <div className="flex justify-center gap-3 items-center">
                <div className="h-12 w-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST}${userInfo.image}`}
                                alt="profile"
                                className="object-cover w-full h-full bg-black"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        ) : (
                            <div
                                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center text-white ${getColor(userInfo.color)}`}>
                                {userInfo.firstname ? userInfo.firstname.charAt(0) : userInfo.username.charAt(0)}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstname && userInfo.lastname
                        ? `${userInfo.firstname} ${userInfo.lastname}`
                        : ""}
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2
                                className="font-medium text-orange-700 text-xl"
                                onClick={() => navigate("/profile")}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] text-white border-none">
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp
                                className="font-medium text-orange-700 text-xl"
                                onClick={logOut}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] text-white border-none">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProfileInfo;
