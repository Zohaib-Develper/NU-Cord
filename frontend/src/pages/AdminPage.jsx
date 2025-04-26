import React, { useState } from "react";
import AllUsers from "../components/admin/AllUsers";
import AllServers from "../components/admin/AllServers";
import { FaPlus, FaMinus } from "react-icons/fa";
import logo from "../assets/logo.png";
const AdminPage = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showServers, setShowServers] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex flex-col items-center">
      <img
        src={logo}
        alt="Logo"
        className="w-24 h-24 object-contain mb-8 animate-pulse drop-shadow-lg"
      />

      <h1 className="text-5xl font-extrabold text-indigo-400 mb-20 text-center">
      Admin👑 Panel ma Swagat hai Boss!
      </h1>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* All Users Section */}
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div
            className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-700 transition"
            onClick={() => setShowUsers(!showUsers)}
          >
            <h2 className="text-2xl font-bold">Users</h2>
            {showUsers ? <FaMinus /> : <FaPlus />}
          </div>
          {showUsers && (
            <div className="px-6 py-4 border-t border-gray-700">
              <AllUsers />
            </div>
          )}
        </div>

        {/* All Servers Section */}
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div
            className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-700 transition"
            onClick={() => setShowServers(!showServers)}
          >
            <h2 className="text-2xl font-bold">Servers</h2>
            {showServers ? <FaMinus /> : <FaPlus />}
          </div>
          {showServers && (
            <div className="px-6 py-4 border-t border-gray-700">
              <AllServers />
            </div>
          )}
        </div>

        {/* You can add more sections like this easily later */}
      </div>
    </div>
  );
};

export default AdminPage;
