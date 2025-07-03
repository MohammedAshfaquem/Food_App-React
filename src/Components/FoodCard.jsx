import { useState } from "react";

const FoodCard = ({ item }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        backgroundImage: `url("/Hover.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "400px",
      }}
      className={`rounded-xl p-6 text-center transition-all duration-300 ${
        hover ? "bg-yellow-400" : "bg-white"
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={hover ? item.hoverImg : item.defaultImg}
        alt={item.title}
        className={`mx-auto mb-4 h-60 object-contain transition-transform duration-300 ${
          hover ? "scale-110" : "scale-100"
        }`}
      />

      <hr className="border-t-2 border-red-500 w-12 mx-auto mb-2" />
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p className="text-red-600 font-medium text-sm">{item.count}</p>
      <p className="text-black font-semibold text-base">₹{item.price}</p>
    </div>
  );
};

export default FoodCard;
