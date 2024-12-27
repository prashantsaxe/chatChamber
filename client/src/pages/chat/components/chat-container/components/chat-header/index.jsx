import { RiCloseFill } from "react-icons/ri";

export const ChatHeader = ()=>{
    return(
        <div className=" h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
            <div className="flex items-center gap-5 ">
                <div className="flex gap-3 items-center justify-center" ></div>
                <div className="flex gap-5 items-center justify-center " >
                    <button className="text-neutral-500 focus:outline-none focus:text-white trasition-all duration-300">
                        <RiCloseFill className="text-3xl"/>
                    </button>
                </div>
            </div>
            Chat header 
        </div>
    )
}