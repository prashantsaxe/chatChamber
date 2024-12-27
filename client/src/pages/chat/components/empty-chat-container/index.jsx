import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../../assets/lottie-json";

const EmptyChatContainer = () => {
    const  animationDefaultOptions = {
        loop:true,
        autoplay:true,
        animationData  ,
        rendererSettings:{
          preserveAspectRatio:"xMidYMid slice"
        }
    }
    // console.log(animationDefaultOptions);
    return (
        <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-300  "  >
            <Lottie
            isClickToPauseDisabled={true}
            height={200}
            width={200}
            options={animationDefaultOptions}
            />
            <div className="  text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl  text-3xl transition-all duration-300 text-center">
                <h3 className="poppins-medium bold">
                    Hi<span className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-sunset">! </span>welcome to 
                    <span > chat</span><span className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-sunset">Chamber</span>
                </h3>
            </div>
        </div>
    )

}
export default EmptyChatContainer;