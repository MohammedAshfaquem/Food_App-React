import { Search, User } from "lucide-react"; // from lucide-react icons
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className=" px-40 py-4 flex items-center justify-between shadow-sm  h-20 text-white font-bold"
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
  <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200" onClick={()=> navigate("/")}>Home</li>
  <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">About Us</li>
  <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">Services</li>
  <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">Featured</li>
  <li className="cursor-pointer hover:scale-105 transform transition-transform duration-200">Contact Me</li>
</ul>


      {/* Right - Icons */}
      <div className="flex gap-4 items-center">
        <Search className="w-5 h-5 cursor-pointer text-gray-700 hover:text-blue-500" />
        <User className="w-5 h-5 cursor-pointer text-gray-700 hover:text-blue-500" />
      </div>
    </nav>
  );
};

export default Navbar;
