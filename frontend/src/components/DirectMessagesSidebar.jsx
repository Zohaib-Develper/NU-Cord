import React from "react";
import { useState, useEffect, useRef } from "react";
import SearchResult from "./SearchResult";
const DirectMessagesSidebar = ({ directMessages, setSelectedDM }) => {
  const dummyUsers = [
    {
      _id: "1",
      name: "Chand Ali",
      username: "l226945",
      pfp: "https://via.placeholder.com/150",
    },
    {
      _id: "2",
      name: "Zohaib Musharaf",
      username: "l227946",
      pfp: "https://via.placeholder.com/150",
    },
    {
      _id: "3",
      name: "Abdul Rafay",
      username: "l226581",
      pfp: "https://via.placeholder.com/150",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResults, setSearchResults] = useState({
    usersList: [],
  });
  const searchRef = useRef(null);
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() === "") {
        setSearchResults({ groupsList: [] });
        return;
      }

      const lowerSearch = searchTerm.toLowerCase();
      const filteredUsers = dummyUsers.filter((user) =>
        user.name.toLowerCase().includes(lowerSearch)
      );

      setSearchResults({ usersList: filteredUsers });
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
        setSearchResults({ usersList: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Direct Messages</h2>
      <div className="relative mb-3" ref={searchRef}>
        <input
          type="text"
          placeholder="Search people..."
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        {searchResults.usersList.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-gray-700 rounded-lg mt-2 shadow-lg z-10">
            <div className="max-h-60 overflow-y-auto">
              <h3 className="text-gray-300 px-3 py-1">Users</h3>
              <ul>
                {searchResults.usersList.map((user) => (
                  <li
                    key={user._id}
                    className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchTerm("");
                      setSearchResults({ usersList: [] });
                    }}>
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {directMessages.map((dm, index) => (
        <p
          key={index}
          className="p-2 rounded-lg hover:bg-gray-600 mb-3 cursor-pointer flex gap-3 items-center"
          onClick={() => {
            setSelectedDM(dm);
          }}>
          <img
            src={dm.pfp}
            alt="User Profile"
            className="h-7 w-7 rounded-full"
          />
          <span className="font-semibold">{dm.name}</span>
          <span className="text-xs text-gray-400">@{dm.username}</span>
        </p>
      ))}
      {selectedUser && (
        <div className="mt-4">
          <SearchResult type={"user"} data={selectedUser} onClose={() => setSelectedUser(null)}/>
        </div>
      )}
    </div>
  );
};

export default DirectMessagesSidebar;
