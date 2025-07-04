import { Search, User, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await API.get(`/users/${user.id}`);
          const cartItems = res.data.cart || [];
          setCartCount(cartItems.length); // ✅ Only unique items
        } catch (err) {
          console.error("Failed to load cart", err);
        }
      }
    };

    fetchCart();
  }, [user]);

  return (
    <nav
      className="px-40 py-4 flex items-center justify-between shadow-sm h-20 text-white font-bold"
      style={{ backgroundColor: "rgba(125, 63, 212, 0.47)" }}
    >
      {/* Left - Logo */}
      <div
        className="text-lg font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Logo
      </div>

      {/* Center - Nav Links */}
      <ul className="flex gap-8 text-sm font-medium text-white">
        <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200" onClick={() => navigate("/")}>Home</li>
        <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">About Us</li>
        <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">Services</li>
        <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">Featured</li>
        <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">Contact Me</li>
      </ul>

      {/* Right - Icons */}
      <div className="flex gap-6 items-center relative">
        <Search className="w-5 h-5 cursor-pointer text-gray-700 hover:text-blue-500" />
        <User className="w-5 h-5 cursor-pointer text-gray-700 hover:text-blue-500" />
        
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-500" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
