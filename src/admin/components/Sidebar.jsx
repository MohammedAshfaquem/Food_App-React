// 🟡 Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUtensils,
  FaHeart,
  FaHistory,
  FaCog,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Food Order", icon: <FaUtensils />, path: "/admin/food-orders" },
    { name: "Favorite", icon: <FaHeart />, path: "/admin/favorites" },
    { name: "Users", icon: <FaUser />, path: "/admin/users" },
    {
      name: "Product Management",
      icon: <FaHistory />,
      path: "/admin/order-history",
    },
  ];

  const handleLogout = () => {
    logout(); // Clear user and localStorage
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-lg p-6 fixed top-0 left-0 z-50">
      <h1 className="text-2xl font-bold text-purple-800 mb-8">
        FoodRush<span className="text-grey-800">.</span>
      </h1>
      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-purple-400 text-white"
                  : "text-gray-600 hover:bg-purple-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* 🔴 LogOut Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span>LogOut</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
