import { Search, User, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      if (user) {
        try {
          const res = await API.get(`/users/${user.id}`);
          const cartItems = res.data.cart || [];
          const wishlistItems = res.data.wishlist || [];

          // ✅ Cart: show unique item count
          const uniqueCart = cartItems.length;

          // ✅ Wishlist: show unique item count
          const uniqueWishlist = wishlistItems.length;

          setCartCount(uniqueCart);
          setWishlistCount(uniqueWishlist);
        } catch (err) {
          console.error("Error fetching counts", err);
        }
      }
    };

    fetchCounts();
  }, [user]);

  return (
    <nav
      className="px-40 py-4 flex items-center justify-between shadow-sm h-20 text-white font-bold"
      style={{ backgroundColor: "rgba(125, 63, 212, 0.47)" }}
    >
      {/* Logo */}
      <div
        className="text-lg font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Logo
      </div>

      {/* Navigation Links */}
      <ul className="flex gap-8 text-sm font-medium text-white">
        <li className="cursor-pointer hover:scale-105" onClick={() => navigate("/")}>Home</li>
        <li className="cursor-pointer hover:scale-105">Popular</li>
        <li className="cursor-pointer hover:scale-105">Services</li>
        <li className="cursor-pointer hover:scale-105" onClick={() => navigate("/orders")}>Orders</li>
        <li className="cursor-pointer hover:scale-105">Contact</li>
      </ul>

      {/* Icons Section */}
      <div className="flex gap-6 items-center relative text-black">

        {/* 🧡 Wishlist */}
        <div className="relative cursor-pointer" onClick={() => navigate("/wishlist")}>
          <Heart />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>

        {/* 🛒 Cart */}
        <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
          <ShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>

        {/* 👤 User */}
        <User className="cursor-pointer hover:text-blue-500" />
      </div>
    </nav>
  );
};

export default Navbar;
