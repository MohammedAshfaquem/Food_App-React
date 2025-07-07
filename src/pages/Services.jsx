import React from "react";

const services = [
  {
    title: "Best Quality Food",
    img: "BurgerIcon.png",
    desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
  },
  {
    title: "Home Delivery",
    img: "Delivery.png",
    desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
  },
  {
    title: "Real Taste",
    img: "Realtaste.png",
    desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
  },
  {
    title: "Traditional Food",
    img: "Traditional.png",
    desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
  },
];

const OurServices = () => {
  return (
    <section className="py-16 px-4 bg-[#fafafa]">
      <h2 className="text-center text-4xl font-bold mb-10">Our Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative bg-[#f0f0f0] rounded-2xl p-6 text-center shadow-lg h-[300px] justify-around flex flex-col"
          >
           

            <img
              src={service.img}
              alt={service.title}
              className="h-20 mx-auto mb-4 object-contain"
            />
            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;
