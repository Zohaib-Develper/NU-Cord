import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUserFriends,
  FaServer,
  FaPaperPlane,
  FaCog,
} from "react-icons/fa";
import Logo from "../assets/logo.png";
import Settings from "./Settings";

const Sidebar = ({ setSelectedCategory }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-24 bg-gray-800 text-white h-screen flex flex-col items-center p-4 justify-between border-r-2 border-gray-700">
      <div>
        <div className="md:flex md:items-center md:gap-12 text-[#5e17eb] font-semibold">
          <a
            className="flex items-end gap-1"
            onClick={() => setSelectedCategory("LandingPage")}
          >
            <img src={Logo} alt="Logo" className="h-14 w-auto" />
          </a>
        </div>
        <div className="flex flex-col items-center space-y-4 mt-6">
          <div
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
            onClick={() => setSelectedCategory("server")}
          >
            <FaServer className="text-xl text-white" />
          </div>
          <div
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
            onClick={() => setSelectedCategory("group")}
          >
            <FaUserFriends className="text-xl text-white" />
          </div>
          <div
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
            onClick={() => setSelectedCategory("dm")}
          >
            <FaPaperPlane className="text-xl text-white" />
          </div>
          <div
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
            onClick={() => setIsSettingsOpen(true)}
          >
            <FaCog className="text-xl text-white" />
          </div>
        </div>
      </div>
      <FaSignOutAlt className="text-xl text-white hover:text-red-600 cursor-pointer" />
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default Sidebar;
