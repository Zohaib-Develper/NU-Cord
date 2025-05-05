import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaHashtag,
  FaVolumeUp,
} from "react-icons/fa";
import SearchResult from "../components/SearchResult";
import axios from "axios";
const ServersSideBar = ({ servers, setSelectedChannel }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
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
    setSelectedChannel(channel);
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderChannelList = (channels, type) => {
    return channels.map((channel, i) => (
      <p
        key={channel._id || i}
        className="ml-2 text-gray-300 cursor-pointer hover:text-white flex items-center gap-2"
        onClick={() => handleChannelClick(channel)}
      >
        {type === "text" ? (
          <FaHashtag className="text-xs" />
        ) : (
          <FaVolumeUp className="text-xs" />
        )}
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

  return (
    <div>
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
