// src/Components/Footer.jsx
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f7f5f1] text-gray-700 border-t py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">
        {/* Logo and Contact */}
        <div className="min-w-[200px]">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">FoodRush</h2>
          <div className="flex items-center mb-2">
            <Mail className="w-4 mr-2" />
            <span>FoodRush.com</span>
          </div>
          <div className="flex items-center mb-2">
            <Phone className="w-4 mr-2" />
            <span>9946832484</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 mr-2" />
            <span>BridgeOn 1st floor, KINFRA</span>
          </div>
        </div>

        {/* Popular Foods */}
        <div className="min-w-[150px]">
          <h3 className="font-bold mb-3 text-violet-600 ">Popular Foods</h3>
          <ul className="space-y-1">
            <li className="transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
              Burger
            </li>
            <li className="transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
              Combo
            </li>
            <li className="transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
              Noodles
            </li>
            <li className="transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
              Pizza
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="min-w-[150px]">
          <h3 className="font-bold mb-3 text-violet-600">Social</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
              <a
                href="https://www.facebook.com/bridgeonfb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            </li>
            <li className="flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
              <a
                href="https://www.instagram.com/bridgeon.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </li>
            <li className="flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
              <a
                href="https://www.youtube.com/@Bridgeon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Youtube className="w-4 h-4" /> YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-sm text-gray-500 mt-10 border-t pt-4">
        © 2025 Templately. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
