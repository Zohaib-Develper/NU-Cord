import React, { useContext, useState } from "react";
import Chat from "./Chat";
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
import DirectMessagesSidebar from "./DirectMessagesSidebar";
import ServersSideBar from "./ServersSideBar";
import GroupsSideBar from "./GroupsSidebar";

const getProfilePicUrl = (pfp) => {
  if (!pfp) return ProfileImage;
  if (pfp.startsWith('/uploads/')) {
    return `http://localhost:8000${pfp}`;
  }
  return pfp;
};

const PageSpecificSidebar = ({ pageName, data, setSelected, refreshGroups }) => {
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useContext(AuthContext).user;

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white border-r-2 border-gray-600 p-4 h-full">
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
        <GroupsSideBar groups={data} setSelectedGroup={setSelected} refreshGroups={refreshGroups} />
      )}

      {/* Direct Messages */}
      {pageName === "directMessages" && (
        <DirectMessagesSidebar
          directMessages={data}
          setSelectedDM={setSelected}
        />
      )}
    </div>
  );
};

export default PageSpecificSidebar;
