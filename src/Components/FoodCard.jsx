import { useState } from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useWishlist } from "../context/Wishlistcontext";

const FoodCard = ({ item, viewMode = "simple" }) => {
  const [hover, setHover] = useState(false);
  const { user } = useAuth();
  const cart = useCart();
  const wishlist = useWishlist();

  const isWishlisted = wishlist.wishlist.some((w) => w.id === item.id);
  const view = viewMode === "detailed";

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to use wishlist");
      return;
    }

    if (isWishlisted) {
      wishlist.removeFromWishlist(item.id);
    } else {
      wishlist.addToWishlist(item);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    cart.addToCart(item);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative text-center rounded-xl p-4 transition-all duration-300 overflow-hidden cursor-pointer ${
        hover ? "bg-yellow-400" : "bg-white"
      }`}
      style={{
        backgroundImage: 'url("/Hover.jpg")',
        backgroundSize: "cover",
        height: "400px",
      }}
    >
      {view && hover && (
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-3 left-3 bg-white p-2 rounded-full shadow z-10"
        >
          <FaHeart
            className={`text-lg transition-colors duration-300 ${
              isWishlisted ? "text-red-500" : "text-black"
            }`}
          />
        </button>
      )}

      <img
        src={item.defaultImg}
        alt={item.title}
        className={`mx-auto mb-4 h-60 object-contain transition-transform duration-300 ${
          hover ? "scale-110" : "scale-100"
        }`}
      />

      {view ? (
        <>
          {hover && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-black text-white py-2 px-4 rounded-full flex items-center justify-center gap-2 mx-auto mb-2"
            >
              <FaShoppingCart /> Add To Cart
            </button>
          )}
          <div className="text-sm mb-1 text-red-600 font-bold">
            ₹{item.price}
          </div>
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
          <hr className="border-t-2 border-purple-600 w-12 mx-auto mb-2" />
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p className="text-purple-600 text-sm">{item.count}</p>
          <p className="text-black font-semibold">₹{item.price}</p>
        </>
      )}
    </div>
  );
};

export default FoodCard;
