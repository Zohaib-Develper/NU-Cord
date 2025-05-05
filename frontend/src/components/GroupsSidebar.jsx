import React, { useState, useEffect, useRef } from "react";
import {
  FaComments,
  FaUserFriends,
  FaUser,
  FaCrown,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import SearchResult from "../components/SearchResult";
const GroupsSideBar = ({ groups, setSelectedGroup }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const [groupss, setGroups] = useState([]);

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
      const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(lowerSearch)
      );

      setSearchResults({ groupsList: filteredGroups });
    }
  };
  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/groups/join/${groupId}`,

        {
          withCredentials: true,
        }
      );
      setSelectedGroups(null);
    } catch (error) {
      alert(error.response?.data?.error);
      console.error("Error fetching friend requests:", error);
    }
  };
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/groups", {
          withCredentials: true,
        });
        if (response.data) {
          console.log("Response.data: ", response.data);
          setGroups(response.data.groups);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchGroups();
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
        setSelectedGroup({ ...group, type: "group" });
      }
    }
  };

  const handleShowMembers = () => {
    setShowMembers((prev) => !prev);
  };

  const getProfilePicUrl = (pfp) => {
    if (!pfp) return "";
    if (pfp.startsWith("/uploads/")) {
      return `http://localhost:8000${pfp}`;
    }
    return pfp;
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
                      console.log("SELEC: ", group);
                      setSelectedGroups(group);
                      setSearchTerm("");
                      setSearchResults({ groupsList: [] });
                    }}
                  >
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
              onClick={() => handleGroupClick(group)}
            >
              {group.name}
            </button>

            {/* Show Chat + Members if group is expanded */}
            {expandedGroup?.name === group.name && (
              <div className="ml-4 mt-2">
                <button
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-600 flex gap-3"
                  onClick={() => {
                    if (setSelectedGroup)
                      setSelectedGroup({ ...group, type: "group" }, "chat");
                  }}
                >
                  <FaComments className="mt-1" />
                  Chat
                </button>
                <button
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-600 mt-1 flex gap-3"
                  onClick={handleShowMembers}
                >
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
                          const adminId = String(
                            group.admin?._id || group.admin?.id || group.admin
                          );
                          const aId = String(a._id || a.id || a);
                          const bId = String(b._id || b.id || b);
                          if (aId === adminId) return -1;
                          if (bId === adminId) return 1;
                          return 0;
                        })
                        .map((user, i) => {
                          const adminId = String(
                            group.admin?._id || group.admin?.id || group.admin
                          );
                          const userId = String(user._id || user.id || user);
                          const isAdmin = adminId === userId;
                          return (
                            <p
                              key={i}
                              className="ml-2 mt-2 text-gray-300 flex gap-3 items-center"
                            >
                              <img
                                src={getProfilePicUrl(user.pfp)}
                                alt="User"
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              {user.name || userId}
                              {isAdmin && (
                                <span className="text-yellow-300 text-sm font-semibold ml-2">
                                  Admin
                                </span>
                              )}
                            </p>
                          );
                        })}
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
          <SearchResult
            type={"group"}
            data={selectedGroups}
            onClose={() => setSelectedGroups(null)}
            onClick={handleJoinGroup}
          />
        </div>
      )}
    </div>
  );
};

export default GroupsSideBar;
