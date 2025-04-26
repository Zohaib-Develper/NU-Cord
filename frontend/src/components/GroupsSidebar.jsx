import React, { useState } from "react";
import { FaComments, FaUserFriends, FaUser } from "react-icons/fa";

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
                    {group.members.map((member, i) => (
                      <p key={i} className="ml-2 mt-2 text-gray-300 flex gap-3">
                        <FaUser className="text-sm mt-1" />
                        {member}
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
