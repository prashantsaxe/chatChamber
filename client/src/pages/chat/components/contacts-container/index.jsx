import React from "react";
import ProfileInfo from "./components/profile-info";
import  NewDm  from "./components/new-dm";

const ContactsContainer = () => {

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2  " >
            <div className="pt-3">
                <Logo/>
            </div>
            <div className=" my-5 ">
                <div className="flex items-center justify-between pr-10 ">
                    <Title text = "Direct Messages  "/>
                    <NewDm/>
                </div>
            </div>
            <div className=" my-5 ">
                <div className="flex items-center justify-between pr-10 ">
                    <Title text = "  channels "/>
                </div>
            </div>
            <ProfileInfo/>
        </div>
         
    )

}
export default ContactsContainer;

const Logo = () => {
    return(
        <div className="flex p-5 justify-start items-center gap-2">
        <svg
          width="78"
          height="32"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9500" />
              <stop offset="100%" stopColor="#FFCC00" />
            </linearGradient>
          </defs>
          <rect width="78" height="32" rx="16" fill="url(#gradient)" />
          <path
            d="M14 8C10.6863 8 8 10.6863 8 14V18C8 21.3137 10.6863 24 14 24H25.1716L29.5858 28.4142C30.3668 29.1953 31.6332 29.1953 32.4142 28.4142L36.8284 24H64C67.3137 24 70 21.3137 70 18V14C70 10.6863 67.3137 8 64 8H14Z"
            fill="white"
          />
          <path
            d="M20 13L24 17L20 21"
            stroke="#FF9500"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 13L28 17L32 21"
            stroke="#FF9500"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M40 14H58"
            stroke="#FFCC00"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M44 18H54"
            stroke="#FFCC00"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">Chamber</span>
      </div>
    )
  };
  
  const Title = ({text}) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
            {text}
        </h6>
    )
  }