import React, { useState } from "react";
import {
  FaComments,
  FaUserFriends,
  FaUser,
  FaCrown,
  FaSignOutAlt,
} from "react-icons/fa";

const GroupsSideBar = ({ groups, setSelectedGroup }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showMembers, setShowMembers] = useState(false);

  const handleGroupClick = (group) => {
    if (expandedGroup?.name === group.name) {
      setExpandedGroup(null);
      setShowMembers(false);
    } else {
      setExpandedGroup(group);
      setShowMembers(false);
      if (setSelectedGroup) {
        setSelectedGroup({ ...group, type: 'group' });
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
                    if (setSelectedGroup) setSelectedGroup({ ...group, type: 'group' }, "chat");
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
                          const adminId = String(group.admin?._id || group.admin?.id || group.admin);
                          const aId = String(a._id || a.id || a);
                          const bId = String(b._id || b.id || b);
                          if (aId === adminId) return -1;
                          if (bId === adminId) return 1;
                          return 0;
                        })
                        .map((user, i) => {
                          const adminId = String(group.admin?._id || group.admin?.id || group.admin);
                          const userId = String(user._id || user.id || user);
                          const isAdmin = adminId === userId;
                          return (
                            <p
                              key={i}
                              className="ml-2 mt-2 text-gray-300 flex gap-3 items-center"
                            >
                              <FaUser className="text-sm mt-1" />
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
    </div>
  );
};

export default GroupsSideBar;
