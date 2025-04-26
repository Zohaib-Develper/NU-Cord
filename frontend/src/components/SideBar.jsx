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
import axios from "axios";

const Sidebar = ({ setSelectedCategory }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/user/logout", { withCredentials: true });
      localStorage.clear();
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-24 bg-gray-800 text-white h-screen flex flex-col items-center p-4 justify-between border-r-2 border-gray-700">
      <div>
        <div className="md:flex md:items-center md:gap-12 text-[#5e17eb] font-semibold">
          <Link className="flex items-end gap-1" to="/home">
            <img src={Logo} alt="Logo" className="h-14 w-auto" />
          </Link>
        </div>
        <div className="flex flex-col items-center space-y-4 mt-6">
          <Link
            to="/servers"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
          >
            <FaServer className="text-xl text-white" />
          </Link>
          <Link
            to="/groups"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
          >
            <FaUserFriends className="text-xl text-white" />
          </Link>
          <Link
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
            to="/directmessages"
          >
            <FaPaperPlane className="text-xl text-white" />
          </Link>
          <div
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer"
            onClick={() => setIsSettingsOpen(true)}
          >
            <FaCog className="text-xl text-white" />
          </div>
        </div>
      </div>
      <FaSignOutAlt 
        className="text-xl text-white hover:text-red-600 cursor-pointer" 
        onClick={handleLogout}
      />
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default Sidebar;
