import React, { useState, useEffect, useRef } from "react";
import {
  FaComments,
  FaUserFriends,
  FaUser,
  FaCrown,
  FaSignOutAlt,
} from "react-icons/fa";
import SearchResult from "../components/SearchResult";
const GroupsSideBar = ({ groups, setSelectedGroup }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  console.log("GROUPS: ", groups);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState(null);
  const [searchResults, setSearchResults] = useState({
    groupsList: [],
  });
  const searchRef = useRef(null);
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() === "") {
        setSearchResults({ groupsList: [] });
        return;
      }

      const lowerSearch = searchTerm.toLowerCase();
      const filteredGroups = dummyGroups.filter((group) =>
        group.name.toLowerCase().includes(lowerSearch)
      );

      setSearchResults({ groupsList: filteredGroups });
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
        setSearchResults({ groupsList: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGroupClick = (group) => {
    if (expandedGroup?.name === group.name) {
      setExpandedGroup(null);
      setShowMembers(false);
    } else {
      setExpandedGroup(group);
      setShowMembers(false);
      if (setSelectedGroup) {
        setSelectedGroup(group); // Inform parent page about selected group
      }
    }
  };

  const handleShowMembers = () => {
    setShowMembers((prev) => !prev);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Joined Groups</h2>
      <div className="relative mb-3" ref={searchRef}>
        <input
          type="text"
          placeholder="Search groups..."
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        {searchResults.groupsList.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-gray-700 rounded-lg mt-2 shadow-lg z-10">
            <div className="max-h-60 overflow-y-auto">
              <h3 className="text-gray-300 px-3 py-1">Groups</h3>
              <ul>
                {searchResults.groupsList.map((group) => (
                  <li
                    key={group._id}
                    className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      setSelectedGroups(group);
                      setSearchTerm("");
                      setSearchResults({ groupsList: [] });
                    }}>
                    {group.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {groups && groups.length > 0 ? (
        groups.map((group, index) => (
          <div key={index} className="mb-3">
            <button
              className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
              onClick={() => handleGroupClick(group)}>
              {group.name}
            </button>

            {/* Show Chat + Members if group is expanded */}
            {expandedGroup?.name === group.name && (
              <div className="ml-4 mt-2">
                <button
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-600 flex gap-3"
                  onClick={() => {
                    if (setSelectedGroup) setSelectedGroup(group, "chat");
                  }}>
                  <FaComments className="mt-1" />
                  Chat
                </button>
                <button
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-600 mt-1 flex gap-3"
                  onClick={handleShowMembers}>
                  <FaUserFriends className="mt-1" />
                  Members
                </button>

                {/* Members List */}
                {showMembers && (
                  <div className="ml-4 mt-2">
                    <h3 className="font-semibold">Members</h3>
                    {group.users &&
                      [...group.users]
                        .sort((a, b) => {
                          const adminId = group.admin;
                          // If a is admin, it comes first
                          if (a._id === adminId || a.id === adminId) return -1;
                          // If b is admin, it comes first
                          if (b._id === adminId || b.id === adminId) return 1;
                          // Otherwise, keep original order
                          return 0;
                        })
                        .map((user, i) => (
                          <p
                            key={i}
                            className="ml-2 mt-2 text-gray-300 flex gap-3 items-center">
                            <FaUser className="text-sm mt-1" />
                            {user.name}
                            {(group.admin === user._id ||
                              group.admin === user.id) && (
                              <span className="flex items-center gap-1 text-yellow-400 ml-2">
                                <FaCrown className="text-xs" />
                                Admin
                              </span>
                            )}
                          </p>
                        ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No groups joined yet.</p>
      )}
      {selectedGroups && (
        <div className="mt-4">
          <SearchResult type={"group"} data={selectedGroups} onClose={() => setSelectedGroups(null)}/>
        </div>
      )}
    </div>
  );
};

export default GroupsSideBar;
