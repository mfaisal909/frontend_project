import React from "react";
import { Lottie } from "lottie-react";
import animationData from "../../../Assests/animationData/loader (1).json";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie src={animationData} loop autoplay style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default Loader;