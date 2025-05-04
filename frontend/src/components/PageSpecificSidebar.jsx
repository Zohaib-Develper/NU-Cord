import React, { useContext, useState, useEffect, useRef } from "react";
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
import DirectMessagesSidebar from "./DirectMessagesSidebar";
import ServersSideBar from "./ServersSideBar";
import GroupsSideBar from "./GroupsSidebar";
import UserProfileModal from "../components/UserProfileModal";
import ServerProfileModal from "../components/ServerProfileModal";
import axios from "axios";

const PageSpecificSidebar = ({ pageName, data, setSelected }) => {
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const user = useContext(AuthContext).user;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    users: [],
    servers: [],
  });
  const searchRef = useRef(null);
  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value.trim() === "") {
      setSearchResults({ users: [], servers: [] });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/search?query=${e.target.value}`,
        { withCredentials: true }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
        setSearchResults({ users: [], servers: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex flex-col  min-h-screen bg-gray-800 text-white border-r-2 border-gray-600 p-4 overflow-y-auto">
      <div className="relative mb-4" ref={searchRef}>
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-2 outline-none"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <div className="absolute top-full left-0 w-full bg-gray-700 rounded-lg mt-2 shadow-lg z-10">
            <div className="max-h-60 overflow-y-auto">
              {searchResults.users.length > 0 && (
                <div>
                  <h3 className="text-gray-300 px-3 py-1">Users</h3>
                  <ul>
                    {searchResults.users.map((user) => (
                      <li
                        key={user._id}
                        className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                        onClick={() => setSelectedUser(user)}>
                        {user.name}{" "}
                        <span className="text-gray-400 text-xs">
                          ({user.username})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.servers.length > 0 && (
                <div>
                  <h3 className="text-gray-300 px-3 py-1">Servers</h3>
                  <ul>
                    {searchResults.servers.map((server) => (
                      <li
                        key={server._id}
                        className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                        onClick={() => setSelectedServer(server)}>
                        {server.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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
        <DirectMessagesSidebar
          directMessages={data}
          setSelectedDM={setSelected}
        />
      )}

      <div className="w-full bg-gray-900 text-white mt-auto flex items-center justify-between h-14 p-4">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsProfileOpen(true)}>
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
            onClick={() => setIsMicMuted(!isMicMuted)}>
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
            onClick={() => setIsVideoOff(!isVideoOff)}>
            {isVideoOff ? (
              <FaVideoSlash className="text-xl cursor-pointer" />
            ) : (
              <FaVideo className="text-xl cursor-pointer" />
            )}
          </button>
        </div>
      </div>
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {selectedServer && (
        <ServerProfileModal
          server={selectedServer}
          onClose={() => setSelectedServer(null)}
        />
      )}
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default PageSpecificSidebar;
