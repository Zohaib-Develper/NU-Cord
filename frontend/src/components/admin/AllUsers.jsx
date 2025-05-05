import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Ban, CheckCircle, Search, AlertCircle, Shield } from "lucide-react";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/user/all", {
          withCredentials: true,
        });
        setUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  async function handleRemoveUser(userId) {
    if (confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:8000/user/${userId}`, {
          withCredentials: true,
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  }

  async function handleSuspendUser(userId) {
    try {
      await axios.post(
        `http://localhost:8000/user/suspend/${userId}`,
        {},
        { withCredentials: true }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isSuspended: true } : user
        )
      );
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  }

  async function handleUnsuspendUser(userId) {
    try {
      await axios.post(
        `http://localhost:8000/user/unsuspend/${userId}`,
        {},
        { withCredentials: true }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isSuspended: false } : user
        )
      );
    } catch (error) {
      console.error("Error unsuspending user:", error);
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = filteredUsers.filter((user) => !user.isSuspended);
  const suspendedUsers = filteredUsers.filter((user) => user.isSuspended);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 flex items-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-green-600 to-green-400 mr-4">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Users</p>
            <p className="text-xl font-bold">{activeUsers.length}</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 flex items-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-red-600 to-red-400 mr-4">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Suspended Users</p>
            <p className="text-xl font-bold">{suspendedUsers.length}</p>
          </div>
        </div>
      </div>

      {/* Active Users Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-green-400 flex items-center">
          <Shield size={18} className="mr-2" />
          Active Users
        </h3>
        {activeUsers.length > 0 ? (
          <div className="bg-gray-850 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-700">
              {activeUsers.map((user) => (
                <li
                  key={user._id}
                  className="group hover:bg-gray-750 transition-colors"
                >
                  <div className="p-4 flex items-center">
                    <img
                      src={user.pfp}
                      alt={`${user.name}'s profile`}
                      className="w-10 h-10 rounded-full mr-4 object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-md font-medium text-white truncate">
                        {user.name}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSuspendUser(user._id)}
                        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5 rounded-md shadow transition-colors duration-200"
                      >
                        <Ban size={14} />
                        Suspend
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md shadow transition-colors duration-200"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400 text-sm bg-gray-800/50 p-4 rounded-lg">
            No active users found.
          </p>
        )}
      </section>

      {/* Suspended Users Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-red-400 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          Suspended Users
        </h3>
        {suspendedUsers.length > 0 ? (
          <div className="bg-gray-850 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-700">
              {suspendedUsers.map((user) => (
                <li
                  key={user._id}
                  className="group hover:bg-gray-750 transition-colors"
                >
                  <div className="p-4 flex items-center">
                    <img
                      src={user.pfp}
                      alt={`${user.name}'s profile`}
                      className="w-10 h-10 rounded-full mr-4 object-cover border-2 border-gray-600 group-hover:border-green-500 transition-colors opacity-60 grayscale"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-md font-medium text-gray-400 truncate">
                        {user.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUnsuspendUser(user._id)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md shadow transition-colors duration-200"
                      >
                        <CheckCircle size={14} />
                        Unsuspend
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user._id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md shadow transition-colors duration-200"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400 text-sm bg-gray-800/50 p-4 rounded-lg">
            No suspended users found.
          </p>
        )}
      </section>
    </div>
  );
}

export default AllUsers;