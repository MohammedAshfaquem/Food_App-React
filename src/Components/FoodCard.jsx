import { useState } from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "react-toastify";

const FoodCard = ({ item, viewMode = "simple" }) => {
  const { user } = useAuth();
  const [hover, setHover] = useState(false);

  const isDetailed = viewMode === "detailed";

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault();  // Prevent page reload

    if (!user) {
      toast.error("Please log in to add to cart");
      return;
    }

    try {
      const res = await API.get(`/users/${user.id}`);
      const currentCart = res.data.cart || [];

      const exists = currentCart.find((p) => p.id === item.id);
      let updatedCart;

      if (exists) {
        updatedCart = currentCart.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        updatedCart = [...currentCart, { ...item, quantity: 1 }];
      }

      await API.patch(`/users/${user.id}`, { cart: updatedCart });
      toast.success("Added to cart 🎉");
    } catch (err) {
      toast.error("Error adding to cart");
      console.error(err);
    }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative cursor-pointer text-center rounded-xl p-4 transition-all duration-300 ${
        hover ? "bg-yellow-400" : "bg-white"
      }`}
      style={{
        backgroundImage: 'url("/Hover.jpg")',
        backgroundSize: "cover",
        height: "400px",
      }}
    >
      {/* Heart Icon */}
      {isDetailed && hover && (
        <button
          type="button"
          className="absolute top-3 left-3 bg-white p-2 rounded-full shadow"
        >
          <FaHeart />
        </button>
      )}

      {/* Product Image */}
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
          {/* Add to Cart */}
          {hover && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-black text-white py-2 px-4 rounded-full flex items-center justify-center gap-2 mx-auto mb-2"
            >
              <FaShoppingCart /> Add To Cart
            </button>
          )}
          <div className="text-sm mb-1 text-red-600 font-bold">₹{item.price}</div>
          <h3 className="font-bold text-base">{item.title}</h3>
          <div className="flex justify-center mt-1 text-yellow-500 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(item.rating)
                    ? hover
                      ? "text-black"
                      : "text-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </>
      ) : (
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
