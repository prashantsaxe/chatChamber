import { clsx } from "clsx";
import { animate } from "framer-motion";
import { twMerge } from "tailwind-merge"
import animationData from "../assets/lottie-json";
import { render } from "react-dom";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ffd6a257] text-[#ff006e] border-[1px] border-[#ffd6a2aa]",
  "bg-[#06d6a057] text-[#ff006e] border-[1px] border-[#06d6a0aa]",
  "bg-[#4cc9f057] text-[#ff006e] border-[1px] border-[#4cc9f0aa]"
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return color[1];
}

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
}

