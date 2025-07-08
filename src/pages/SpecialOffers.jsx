import React from "react";

const SpecialOffers = () => {
  return (
    <section className="bg-[#f8f6f1] py-10 px-4">
      <h2 className="text-center text-4xl font-bold mb-10">Today Offers</h2>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
        <div className="bg-black text-white rounded-2xl overflow-hidden flex-1 flex flex-col justify-between p-6 relative min-h-[300px]">
          <div className="z-10 pt-12 pl-6">
            <p className="text-sm">TODAY</p>
            <h2 className="text-3xl font-extrabold mt-1">SPECIAL</h2>
            <p className="text-lg mt-2">
              BEEF <span className="text-yellow-400">BURGER</span>
            </p>
          </div>
          <img
            src="Burger.png"
            alt="Beef Burger"
            className="w-40 md:w-56 absolute bottom-4 right-4 object-contain max-w-full max-h-full"
          />
        </div>

        <div className="bg-gray-900 text-white rounded-2xl overflow-hidden flex-1 flex flex-col justify-between p-6 relative min-h-[300px]">
          <div className="z-10 pt-12 pl-6 pr-6">
            <p className="text-red-500 text-sm  ">
              CRISPY, EVERY BITE TASTE
            </p>
            <h2 className="text-3xl font-extrabold mt-1">FASH FOOD MEAL</h2>
            <p className="text-sm mt-2 text-gray-300">
              The mouth-watering aroma of sizzling <br /> burgers
            </p>

            <div className="absolute top-6 right-6 bg-yellow-400 text-black font-bold text-xs px-2 py-1 rounded-full">
              50% OFF
            </div>
          </div>
          <img
            src="Meat.png"
            alt="Roller Box"
            className="w-44 md:w-60 absolute bottom-0 right-0 object-contain max-w-full max-h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
