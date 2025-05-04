import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import FriendsImage from "../assets/friends.png";
import UserProfileModal from "../components/UserProfileModal";
import ServerProfileModal from "../components/ServerProfileModal";

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
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
    <div className="w-full bg-gray-800 text-white flex-1 p-4 md:p-8">
      <div className="mb-6 w-full relative max-w-6xl mx-auto" ref={searchRef}>
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search for friends, messages, or groups..."
          className="w-full pl-12 pr-4 py-2 rounded-lg shadow-md text-white bg-gray-700 text-base md:text-lg focus:outline-none"
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

      <div className="flex flex-col items-center justify-center">
        <div className="space-y-3 flex flex-col items-center w-full max-w-xl">
          <div className="p-2 w-full md:w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer transition-opacity">
            <h3 className="text-base md:text-lg font-semibold">
              Invite your friends
            </h3>
          </div>
          <div className="p-2 w-full md:w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer transition-opacity">
            <h3 className="text-base md:text-lg font-semibold">
              Say Hi to your class fellows
            </h3>
          </div>
          <div className="p-2 w-full md:w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer transition-opacity">
            <h3 className="text-base md:text-lg font-semibold">
              Study together for your exams
            </h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:mt-16 gap-8 md:gap-16">
          <img
            src={FriendsImage}
            alt="Chatting"
            className="w-40 md:w-50 rounded-lg"
          />
          <h2 className="text-2xl md:text-2xl lg:text-8xl font-bold text-center">
            Happy <br />
            Chatting!
          </h2>
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
    </div>
  );
};

export default Landing;
