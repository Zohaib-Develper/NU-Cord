import React from "react";
import {
  FaSignOutAlt,
  FaUserFriends,
  FaServer,
  FaPaperPlane,
  FaCog,
} from "react-icons/fa";
import Logo from "../assets/logo.png";

const Sidebar = ({ setSelectedCategory }) => {
  return (
    <div className="w-24 bg-gray-800 text-white h-screen flex flex-col items-center p-4 justify-between border-r-2 border-gray-700">
      <div>
        <div className="md:flex md:items-center md:gap-12 text-[#5e17eb] font-semibold">
          <a className="flex items-end gap-1" href="#">
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
          <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer">
            <FaCog className="text-xl text-white" />
          </div>
        </div>
      </div>
      <FaSignOutAlt className="text-xl text-white hover:text-red-600 cursor-pointer" />
    </div>
  );
};

export default Sidebar;
