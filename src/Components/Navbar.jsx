import { useState } from "react";
import { User, Heart, ShoppingCart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    setDropDown(false);
  };

  return (
    <nav className="bg-purple-400 text-white font-bold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between md:ml-20">
        <div
          className="text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/")}
        >
          FoodRush
        </div>

        <ul className="hidden md:flex gap-8 text-sm font-medium">
          <li className="cursor-pointer" onClick={() => navigate("/")}>
            Home
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/all-foods")}>
            Foods
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/orders")}>
            Orders
          </li>
        </ul>

        <div className="flex items-center gap-4 relative text-black">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <Heart />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          <div className="relative">
            <User
              className="cursor-pointer hover:text-blue-500"
              onClick={() => setDropDown(!dropDown)}
            />
            {dropDown && (
              <div className="absolute right-0 mt-2 w-60 bg-white text-black rounded shadow-md z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b font-semibold text-purple-700">
                      {user.name}
                      <br />
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-2 text-gray-500">Not logged in</div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Menu
              className="cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white text-black px-4 py-4 space-y-3 shadow">
          <div
            className="cursor-pointer hover:text-purple-600"
            onClick={() => {
              setIsOpen(false);
              navigate("/");
            }}
          >
            Home
          </div>
          <div
            className="cursor-pointer hover:text-purple-600"
            onClick={() => {
              setIsOpen(false);
              navigate("/all-foods");
            }}
          >
            Foods
          </div>
          <div
            className="cursor-pointer hover:text-purple-600"
            onClick={() => {
              setIsOpen(false);
              navigate("/orders");
            }}
          >
            Orders
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
