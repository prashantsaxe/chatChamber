import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { FaTrash, FaPlus } from "react-icons/fa";
import { colors, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { HOST } from "@/utils/constants";

const Profile = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [image, setImage] = useState("");
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);
    const fileInputRef = useRef(null);

    const validateProfile = () => {
        if (!firstname) {
            toast.error("First Name is required");
            return false;
        }
        if (!lastname) {
            toast.error("Last Name is required");
            return false;
        }
        return true;
    }
    console.log(image);
    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstname);
            setLastName(userInfo.lastname);
            setSelectedColor(userInfo.color);
        }
        if (userInfo.image) {
            console.log("User Info Image:", userInfo.image); // Debugging
    
            //  FIX: Use the image URL directly without `HOST`
            if (userInfo.image.includes("cloudinary.com")) {
                setImage(userInfo.image); //  Use Cloudinary URL directly
            } else {
                setImage(`${HOST}${userInfo.image}`); // If it's a local file (unlikely in this case)
            }
        }
    }, [userInfo]);

    const saveChanges = async (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log("hit");
        if (validateProfile()) {
            try {
                const response = await apiClient.post(
                    UPDATE_PROFILE_ROUTE,
                    { firstname, lastname, color: selectedColor },
                    { withCredentials: true }
                );
                console.log("hit2");
                if (response.status === 200 && response.data) {
                    setUserInfo({ ...response.data });
                    toast.success("Profile Updated Successfully");
                    navigate("/chat");

                }
            } catch (error) {
                console.log({ error });
            }
        };
    };

    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat");
        }
        else {
            toast.error("Please complete your profile setup first");
        }
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
    
        if (!file) return;
        
        // ✅ Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, and WebP formats are allowed!");
            return;
        }
    
        // ✅ Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB!");
            return;
        }
    
        const reader = new FileReader();
        reader.readAsDataURL(file); // Convert to Base64
        reader.onloadend = async () => {
            const base64Image = reader.result;
    
            try {
                const response = await apiClient.post(
                    ADD_PROFILE_IMAGE_ROUTE, 
                    { image: base64Image },
                    { withCredentials: true }
                );
    
                if (response.status === 200 && response.data.image) {
                    setUserInfo({ ...userInfo, image: response.data.image });
                    setImage(response.data.image);
                    toast.success("Image Uploaded Successfully");
                }
            } catch (error) {
                toast.error("Failed to upload image");
                console.error(" Upload Error:", error.response ? error.response.data : error);
            }
        };
    };
    
    const handleDeleteImage = async (e) => {
        try {
            const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
            if (response.status === 200) {
                setUserInfo({ ...userInfo, image: null });
                toast.success("Image Removed Successfully");
                setImage(null);
            }
        } catch (error) {
            console.log({ error });
        }
    }



    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center  flex-col gap-10">
        {/* <img src={image}></img> */}
            <div className="flex flex-col w-full gap-5w-[80vw] ">
                <div>
                    <IoArrowBack
                        className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
                        onClick={handleNavigate}
                    />
                </div>
                <form onSubmit={saveChanges} className="space-y-6">
                    <div className="flex justify-center">
                        <div
                            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                                {image ? (
                                    <AvatarImage src={image} alt="profile" className="object-cover w-full h-full " />
                                ) : (
                                    <div className={`rounded-full uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center  text-white ${getColor(selectedColor)}`}>
                                    {firstname ? firstname.charAt(0) : userInfo.username.charAt(0)}
                                    </div>
                                )}
                            </Avatar>
                            {hovered && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                                    onClick={image ? handleDeleteImage : handleFileInputClick}>
                                    {image ? (
                                        <FaTrash className="text-white text-3xl cursor-pointer" />
                                    ) : (
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <FaPlus className="text-white text-3xl" />
                                        </label>
                                    )}
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png ,.svg, .jpg, .jpeg, .webp" />
                        </div>
                    </div>
                    <div className="space-y-2 w-full flex justify-center">
                        {/* <label htmlFor="firstName" className="text-white">First Name</label> */}
                        <input
                            id="firstname"
                            placeholder="First Name"
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            className=" bg-[#2a2b38] text-white border border-gray-600 rounded-lg w-80 p-2"
                        />
                    </div>
                    <div className="space-y-2 w-full flex justify-center">
                        {/* <label htmlFor="lastName" className="text-white">Last Name</label> */}
                        <input
                            id="lastName"
                            placeholder="Last Name"
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            className=" bg-[#2a2b38] text-white border border-gray-600 rounded-lg w-80 p-2"
                        />
                    </div>

                    <div className="space-y-2 w-full flex justify-center">
                        {/* <label htmlFor="lastName" className="text-white">Last Name</label> */}
                        <input
                            id="username"
                            placeholder="Username"
                            type="text"
                            disabled value={userInfo.username}
                            className=" bg-[#2a2b38] text-gray-500 border border-gray-600 rounded-lg w-80 p-2"
                        />
                    </div>

                    <div className="space-y-2 w-full flex justify-center">
                        {/* <label htmlFor="lastName" className="text-white">Last Name</label> */}
                        <input
                            id="email"
                            placeholder="Email"
                            type="text"
                            disabled value={userInfo.email}
                            className=" bg-[#2a2b38]  text-gray-500 border border-gray-600 rounded-lg w-80 p-2"
                        />
                    </div>

                    <div className=" w-full flex justify-center gap-5">
                        {/* <label className="text-white">Choose Your Color</label> */}

                        {colors.map((color, index) => (
                            <div
                                key={index}
                                className={` ${color}  w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ?
                                    " outline outline-white/80 outline-2 " : ""
                                    }`}
                                onClick={() => setSelectedColor(index)}
                            />
                        ))}

                    </div>
                    <div className="space-y-2 w-full flex justify-center gap-5">
                        <button
                            type="submit"
                            className=" bg-purple-600 hover:bg-purple-900 text-white py-2 transition-all duration-300 rounded-md w-80 flex justify-center"
                            onClick={saveChanges}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;