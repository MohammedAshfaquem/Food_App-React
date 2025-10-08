import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUtensils,
  FaHeart,
  FaHistory,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const Sidebar = ({ isOpen, onClose }) => {
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
      path: "/admin/product-managment",
    },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.info("Logout cancelled");
      }
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`h-screen w-64 bg-white shadow-md p-6 
    fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 md:sticky md:top-0`}
      >
        <h1 className="text-2xl font-bold text-purple-800 mb-10">
          FoodRush<span className="text-gray-700">.</span>
        </h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition ${
                  isActive
                    ? "bg-purple-500 text-white"
                    : "text-gray-700 hover:bg-purple-100"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;


