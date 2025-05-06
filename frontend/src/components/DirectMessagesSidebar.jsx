import React, { useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import Profile from "./Profile";

const getProfilePicUrl = (pfp) => {
  if (!pfp) return '';
  if (pfp.startsWith('/uploads/')) {
    return `http://localhost:8000${pfp}`;
  }
  return pfp;
};

const DirectMessagesSidebar = ({ directMessages, setSelectedDM }) => {
  const { user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-900 text-white border-r border-gray-700">
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-3">Direct Messages</h2>
        {directMessages && directMessages.length > 0 ? (
          directMessages.map((dm, index) => (
            <div
              key={index}
              className="p-2 rounded-lg hover:bg-gray-600 mb-3 cursor-pointer flex gap-3 items-center"
              onClick={() => setSelectedDM(dm)}
            >
              <img
                src={getProfilePicUrl(dm.pfp)}
                alt="User Profile"
                className="h-7 w-7 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{dm.name}</span>
                <span className="text-xs text-gray-400">@{dm.username}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No direct messages yet.</p>
        )}
      </div>
      {/* User Profile Section pinned to bottom */}
      <div className="w-full bg-gray-900 text-white flex items-center justify-between h-16 p-4 border-t border-gray-800">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsProfileOpen(true)}>
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
    </div>
  );
};

export default DirectMessagesSidebar;
