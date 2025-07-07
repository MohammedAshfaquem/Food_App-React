import React from "react";
import Navbar from "../Components/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-10 gap-10">
          <div className="w-full lg:w-1/2 text-center lg:text-left ml-10">
            <p className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-tight mb-4">
              <span className="text-purple-700">Welcome </span>
              <span className="text-gray-800 ">To</span>
              <br />
              <span className="text-gray-800">
                The world of Tasty & Fresh Food.
              </span>
            </p>
            <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-6">
              Keep it easy with these simple but delicious recipes — from
              make-ahead lunches and midweek meals to fuss-free sides.
            </p>
          </div>

          <div className="w-full lg:w-[500px] flex justify-center">
            <img
              src="/Intro.png"
              alt="Intro"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
