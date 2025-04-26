import React, { useContext, useState } from "react";
import ChannelPage from "../components/ChannelPage";
import ProfileImage from "../assets/profile.jpeg";
import Profile from "../components/Profile";
import FriendsProfile from "../assets/profile2.jpeg";
import {
  FaVideoSlash,
  FaMicrophoneSlash,
  FaVideo,
  FaMicrophone,
  FaComments,
  FaUserFriends,
  FaUser,
  FaVolumeUp,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import DirectMessages from "./DirectMessages";
import ServersSideBar from "./ServersSideBar";
import GroupsSideBar from "./GroupsSidebar";

const PageSpecificSidebar = ({ pageName, data, setSelected }) => {
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useContext(AuthContext).user;
  return (
    <div className="flex flex-col w-80 h-screen bg-gray-800 text-white border-r-2 border-gray-600 p-4 overflow-y-auto">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4 outline-none"
      />

      {/* Server Section */}
      {pageName === "servers" && (
        <ServersSideBar servers={data} setSelectedChannel={setSelected} />
      )}

      {/* Group Section */}
      {pageName === "groups" && (
        <GroupsSideBar groups={data} setSelectedGroup={setSelected} />
      )}

      {/* Direct Messages */}
      {pageName === "directMessages" && (
        <DirectMessages directMessages={data} setSelectedDM={setSelected} />
      )}

      {/* Profile Section */}
      <div className="w-full bg-gray-900 text-white mt-auto flex items-center justify-between h-14 p-4">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
        >
          <img
            src={user.pfp}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-400">{user.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`text-xl ${
              isMicMuted ? "text-red-600" : "text-white-500"
            } hover:text-white`}
            onClick={() => setIsMicMuted(!isMicMuted)}
          >
            {isMicMuted ? (
              <FaMicrophoneSlash className="text-xl cursor-pointer" />
            ) : (
              <FaMicrophone className="text-xl cursor-pointer" />
            )}
          </button>
          <button
            className={`text-xl ${
              isVideoOff ? "text-red-600" : "text-white-500"
            } hover:text-white`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? (
              <FaVideoSlash className="text-xl cursor-pointer" />
            ) : (
              <FaVideo className="text-xl cursor-pointer" />
            )}
          </button>
        </div>
      </div>
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default PageSpecificSidebar;
