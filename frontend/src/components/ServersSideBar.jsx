import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaHashtag,
  FaVolumeUp,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import Profile from "./Profile";
import SearchResult from "../components/SearchResult";
import axios from "axios";

const ServersSideBar = ({ servers, setSelectedChannel }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const { user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [serverss, setServers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServer, setSelectedServer] = useState(null);
  const [searchResults, setSearchResults] = useState({
    serversList: [],
  });
  const searchRef = useRef(null);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() === "") {
        setSearchResults({ usersList: [], serversList: [] });
        return;
      }

      const lowerSearch = searchTerm.toLowerCase();
      const filteredServers = serverss.filter((server) =>
        server.name.toLowerCase().includes(lowerSearch)
      );

      setSearchResults({ serversList: filteredServers });
    }
  };
  const handleJoinServer = async (serverId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/servers/${serverId}/join-request`,
        {},

        {
          withCredentials: true,
        }
      );
      setSelectedServer(null);
    } catch (error) {
      alert(error.response?.data?.error);
      console.error("Error fetching friend requests:", error);
    }
  };
  useEffect(() => {
    const fetchServers = async () => {
      axios;
      try {
        const response = await axios.get("http://localhost:8000/api/servers", {
          withCredentials: true,
        });
        if (response.data) {
          console.log("Response.data: ", response.data);
          setServers(response.data.servers);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchServers();
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
        setSearchResults({ serversList: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServerClick = (server) => {
    setSelectedItem(selectedItem?._id === server._id ? null : server);
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel({ ...channel, type: "server" });
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderVoiceChannel = (channel) => (
    <div
      key={channel._id}
      className="relative bg-[#f6e7b4] rounded-xl flex flex-col items-center justify-center mb-4 cursor-pointer shadow-lg border-2 border-gray-300 hover:border-yellow-400 transition-all duration-200"
      style={{ minHeight: 100, minWidth: 220, maxWidth: 320 }}
      onClick={() => handleChannelClick(channel)}
    >
      <div className="flex flex-col items-center justify-center w-full h-full py-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-200 mb-2">
          <FaVolumeUp className="text-2xl text-yellow-600" />
        </div>
        <span className="font-semibold text-gray-800 text-lg mb-2">
          {channel.name}
        </span>
      </div>
    </div>
  );

  const renderChannelList = (channels, type) => {
    const icon =
      type === "voice" ? (
        <FaVolumeUp className="text-xs" />
      ) : (
        <FaHashtag className="text-xs" />
      );
    return channels.map((channel, i) => (
      <p
        key={channel._id || i}
        className="ml-2 text-gray-300 cursor-pointer hover:text-white flex items-center gap-2"
        onClick={() => handleChannelClick(channel)}
      >
        {icon}
        {channel.name}
      </p>
    ));
  };

  const renderCategory = (title, channels, type) => {
    const isExpanded = expandedCategories[title];
    return (
      <div className="mb-2">
        <div
          className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-gray-300"
          onClick={() => toggleCategory(title)}
        >
          {isExpanded ? (
            <FaChevronDown className="text-xs" />
          ) : (
            <FaChevronRight className="text-xs" />
          )}
          <span className="text-sm font-semibold">{title}</span>
        </div>
        {isExpanded && (
          <div className="ml-4 mt-1">{renderChannelList(channels, type)}</div>
        )}
      </div>
    );
  };

  const getProfilePicUrl = (pfp) => {
    if (!pfp) return "";
    if (pfp.startsWith("/uploads/")) {
      return `http://localhost:8000${pfp}`;
    }
    return pfp;
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-900 text-white border-r border-gray-700">
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-3">Joined Servers</h2>
        <div className="relative mb-3" ref={searchRef}>
          <input
            type="text"
            placeholder="Search servers..."
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          {searchResults.serversList.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-gray-700 rounded-lg mt-2 shadow-lg z-10">
              <div className="max-h-60 overflow-y-auto">
                <h3 className="text-gray-300 px-3 py-1">Servers</h3>
                <ul>
                  {searchResults.serversList.map((server) => (
                    <li
                      key={server._id}
                      className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setSelectedServer(server);
                        setSearchTerm("");
                        setSearchResults({ serversList: [] });
                      }}
                    >
                      {server.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {servers && servers.length > 0 ? (
          servers.map((server, index) => (
            <div key={server._id || index} className="mb-3">
              <button
                className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
                onClick={() => handleServerClick(server)}
              >
                {server.name}
              </button>
              {selectedItem?._id === server._id && server.channels && (
                <div className="ml-4 mt-2">
                  {renderCategory(
                    "Text Channels",
                    server.channels.filter(
                      (channel) =>
                        !channel.name.toLowerCase().includes("voice") &&
                        !channel.name.toLowerCase().includes("study")
                    ),
                    "text"
                  )}
                  {renderCategory(
                    "Voice Channels",
                    server.channels.filter(
                      (channel) =>
                        channel.name.toLowerCase().includes("voice") ||
                        channel.name.toLowerCase().includes("study")
                    ),
                    "voice"
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No servers joined yet.</p>
        )}
      </div>
      {/* User Profile Section pinned to bottom */}
      <div className="w-full bg-gray-900 text-white flex items-center justify-between h-16 p-4 border-t border-gray-800">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
        >
          <img
            src={getProfilePicUrl(user?.pfp)}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.username}</p>
          </div>
        </div>
      </div>
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
      {selectedServer && (
        <div className="mt-4">
          <SearchResult
            type={"server"}
            data={selectedServer}
            onClose={() => setSelectedServer(null)}
            onClick={handleJoinServer}
          />
        </div>
      )}
    </div>
  );
};

export default ServersSideBar;
