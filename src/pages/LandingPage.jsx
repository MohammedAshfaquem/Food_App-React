import React from "react";
import Navbar from "../Components/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen flex flex-col bg-white font-sans">
        {/* Hero Section */}
        <div className="flex flex-1 items-center justify-between px-20 py-10  ml-30 ">
          {/* Left */}
          <div className="max-w-xl">
            <span
              style={{
                color: "rgba(121, 42, 231, 0.91) ",
                fontSize: "90px",
                fontWeight: "bold",
              }}
            >
              Welcome <span style={{ color: "black" }}>To</span>
            </span>
            <h1 className="text-6xl font-bold text-gray-800 leading-tight mb-4">
              The world of <br /> Tasty & Fresh Food.
            </h1>
            <p className="text-gray-600  text-2xl leading-relaxed mb-6">
              Keep it easy with these simple but delicious recipes from
              make-ahead lunches and midweek meals to fuss-free sides.
            </p>
          </div>

          {/* Right - Image */}
          <div className="w-[560px] mr-10 ">
            <img
              src="/Intro.png"
              alt="burger"
              className="w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
