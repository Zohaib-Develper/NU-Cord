import React from "react";
import { FaUserPlus, FaSignInAlt, FaUsers } from "react-icons/fa";

const SearchResult = ({ type, data, onClose, onClick }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-lg bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>

        {type === "user" && (
          <>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={data.pfp}
                alt="Profile"
                className="w-16 h-16 rounded-full border border-gray-700"
              />
              <div>
                <h2 className="text-lg font-semibold">{data.name}</h2>
                <p className="text-gray-400">@{data.username}</p>
              </div>
            </div>
            <button
              onClick={() => onClick(data._id)}
              className="w-full py-2 mt-2 rounded bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <FaUserPlus />
              Add Friend
            </button>
          </>
        )}

        {type === "server" && (
          <>
            <h2 className="text-xl font-bold mb-3 flex items-center justify-center">
              {data.name}
            </h2>
            <button
              onClick={onClose}
              className="w-full py-2 rounded bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <FaSignInAlt />
              Join Server
            </button>
          </>
        )}

        {type === "group" && (
          <>
            <h2 className="text-xl font-bold mb-2">{data.name}</h2>
            <p className="text-gray-300 mb-4">Members: {data.users.length}</p>
            <button
              onClick={() => onClick(data._id)}
              className="w-full py-2 rounded bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <FaUsers />
              Request to Join
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
