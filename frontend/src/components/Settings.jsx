import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

const Settings = ({ onClose }) => {
  const context = useContext(AuthContext);
  const [user, setUser] = useState(context.user);

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg flex justify-center items-center"
      onClick={onClose}>
      <div
        className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-xl sm:max-w-2xl lg:max-w-4xl max-h-[80vh] shadow-lg relative flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
          Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <div>
            <label className="text-gray-400">Username</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full bg-gray-800 text-gray-400  p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-gray-400">Name</label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="text-gray-400">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>

          {/* Campus (Read-Only) */}
          <div>
            <label className="text-gray-400">Campus</label>
            <input
              type="text"
              value={user.campus}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>

          {/* Batch (Read-Only) */}
          <div>
            <label className="text-gray-400">Batch</label>
            <input
              type="text"
              value={user.batch}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-gray-400">Program</label>
            <input
              type="text"
              value={user.degree_name}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
