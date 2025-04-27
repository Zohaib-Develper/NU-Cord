import React from "react";
import { useState } from "react";

const DirectMessagesSidebar = ({ directMessages, setSelectedDM }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Direct Messages</h2>
      {directMessages.map((dm, index) => (
        <p
          key={index}
          className="p-2 rounded-lg hover:bg-gray-600 mb-3 cursor-pointer flex gap-3 items-center"
          onClick={() => {
            setSelectedDM(dm);
          }}
        >
          <img
            src={dm.pfp}
            alt="User Profile"
            className="h-7 w-7 rounded-full"
          />
          <span className="font-semibold">{dm.name}</span>
          <span className="text-xs text-gray-400">@{dm.username}</span>
        </p>
      ))}
    </div>
  );
};

export default DirectMessagesSidebar;
