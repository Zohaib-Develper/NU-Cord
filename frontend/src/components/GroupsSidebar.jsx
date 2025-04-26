import React, { useState } from "react";
import { FaComments, FaUserFriends, FaUser, FaCrown } from "react-icons/fa";

const GroupsSideBar = ({ groups, setSelectedGroup }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  console.log("GROUPS: ", groups);

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
                    if (setSelectedGroup) setSelectedGroup(group, "chat");
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
                    {group.users && [...group.users].sort((a, b) => {
                      const adminId = group.admin;
                      // If a is admin, it comes first
                      if (a._id === adminId || a.id === adminId) return -1;
                      // If b is admin, it comes first
                      if (b._id === adminId || b.id === adminId) return 1;
                      // Otherwise, keep original order
                      return 0;
                    }).map((user, i) => (
                      <p key={i} className="ml-2 mt-2 text-gray-300 flex gap-3 items-center">
                        <FaUser className="text-sm mt-1" />
                        {user.name}
                        {(group.admin === user._id || group.admin === user.id) && (
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
    </div>
  );
};

export default GroupsSideBar;
