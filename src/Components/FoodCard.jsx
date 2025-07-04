import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";

const FoodCard = ({ item, viewMode = "simple" }) => {
  const [hover, setHover] = useState(false);

  const isDetailed = viewMode === "detailed";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative cursor-pointer text-center rounded-xl p-4 transition-all duration-300 ${
        hover ? "bg-yellow-400 cursor-poniter" : "bg-white cursor-default"
      }`}
      style={{
        backgroundImage: 'url("/Hover.jpg")',
        backgroundSize: "cover",
        height: "400px",
      }}
    >
      {/* Wishlist button for detailed view */}
      {isDetailed && hover && (
        <button className="absolute top-3 left-3 bg-white p-2 rounded-full shadow">
          <FaHeart />
        </button>
      )}

      {/* Image */}
      <img
        src={item.defaultImg}
        alt={item.title}
        className={`mx-auto mb-4 h-60 object-contain transition-transform duration-300 ${
          hover ? "scale-110" : "scale-100"
        }`}
      />

      {/* Content */}
      {isDetailed ? (
        <>
          {/* Add to Cart on hover */}
          {hover && (
            <button className="bg-black text-white py-2 px-4 rounded-full flex items-center justify-center gap-2 mx-auto mb-2 cursor-pointer">
              <FaShoppingCart /> Add To Cart
            </button>
          )}

          {/* Price */}
          <div className="text-sm mb-1 text-red-600 font-bold">
            ₹{item.price}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base">{item.title}</h3>

          {/* Rating */}
          <div className="flex justify-center mt-1 text-yellow-500 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(item.rating)
                    ? hover?"text-black":"text-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </>
      ) : (
        // Simple View
        <>
          <hr className="border-t-2 border-red-500 w-12 mx-auto mb-2" />
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p className="text-red-600 text-sm">{item.count}</p>
          <p className="text-black font-semibold">₹{item.price}</p>
        </>
      )}
    </div>
  );
};

export default FoodCard;
