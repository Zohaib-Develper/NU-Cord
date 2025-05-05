import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import FriendsImage from "../assets/friends.png";

const dummyUsers = [
  { _id: "1", name: "Chand Ali", username: "l226945" },
  { _id: "2", name: "Zohaib Musharaf", username: "l227946" },
  { _id: "3", name: "Abdul Rafay", username: "l226581" },
];

const dummyServers = [
  { _id: "1", name: "CS-22-LHR" },
  { _id: "2", name: "Gaming Zone" },
  { _id: "3", name: "FYP Group 7" },
];
const dummyGroups = [
  {
    _id: "1",
    name: "CS-22-LHR",
    users: [
      { _id: "1", name: "Chand Ali" },
      { _id: "2", name: "Zohaib Musharaf" },
    ],
    admin: "1",
  },
  {
    _id: "2",
    name: "Gaming Zone",
    users: [{ _id: "3", name: "Abdul Rafay" }],
    admin: "3",
  },
  {
    _id: "3",
    name: "FYP Group 8",
    users: [
      { _id: "1", name: "Chand Ali" },
      { _id: "3", name: "Abdul Rafay" },
    ],
    admin: "1",
  },
];
const Landing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchResults, setSearchResults] = useState({
    usersList: [],
    serversList: [],
    groupsList: [],
  });
  const searchRef = useRef(null);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() === "") {
        setSearchResults({ usersList: [], serversList: [], groupsList: [] });
        return;
      }

      const lowerSearch = searchTerm.toLowerCase();
      const filteredUsers = dummyUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearch) ||
          user.username.toLowerCase().includes(lowerSearch)
      );
      const filteredServers = dummyServers.filter((server) =>
        server.name.toLowerCase().includes(lowerSearch)
      );
      const filteredGroups = dummyGroups.filter((group) =>
        group.name.toLowerCase().includes(lowerSearch)
      );

      setSearchResults({ usersList: filteredUsers, serversList: filteredServers, groupsList: filteredGroups });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
        setSearchResults({ usersList: [], serversList: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-gray-800 text-white flex-1 p-4 md:p-8">
      <div className="mb-6 w-full relative max-w-6xl mx-auto" ref={searchRef}>
        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search for friends or servers..."
          className="w-full pl-12 pr-4 py-2 rounded-lg shadow-md text-white bg-gray-700 text-base md:text-lg focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />

        {searchResults.usersList.length > 0 || searchResults.serversList.length > 0 ? (
          <div className="absolute top-full left-0 w-full bg-gray-700 rounded-lg mt-2 shadow-lg z-10">
            <div className="max-h-60 overflow-y-auto">
              {searchResults.usersList.length > 0 && (
                <div>
                  <h3 className="text-gray-300 px-3 py-1">Users</h3>
                  <ul>
                    {searchResults.usersList.map((user) => (
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
              {searchResults.serversList.length > 0 && (
                <div>
                  <h3 className="text-gray-300 px-3 py-1">Servers</h3>
                  <ul>
                    {searchResults.serversList.map((server) => (
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
              {searchResults.groupsList.length > 0 && (
                <div>
                  <h3 className="text-gray-300 px-3 py-1">Groups</h3>
                  <ul>
                    {searchResults.groupsList.map((group) => (
                      <li
                        key={group._id}
                        className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                        onClick={() => setSelectedGroup(group)}>
                        {group.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : null}
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
    </div>
  );
};

export default Landing;
