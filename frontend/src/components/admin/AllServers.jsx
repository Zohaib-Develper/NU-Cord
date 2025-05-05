import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Trash2, Server, Users, MessageSquare, User, Search } from "lucide-react";

function AllServers() {
  const [servers, setServers] = useState([]);
  const [usersInServer, setUsersInServer] = useState([]);
  const [channelsInServer, setChannelsInServer] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServers() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/servers/", {
          withCredentials: true,
        });
        setServers(res.data.servers);
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServers();
  }, []);

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleServerClick(server) {
    setSelectedServer(server);
    fetchUsersInServer(server._id);
    fetchChannelsInServer(server._id);
  }

  function handleCloseModal() {
    setSelectedServer(null);
    setUsersInServer([]);
    setChannelsInServer([]);
  }

  async function fetchUsersInServer(serverId) {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/servers/${serverId}/users`,
        { withCredentials: true }
      );
      setUsersInServer(res.data.users);
    } catch (error) {
      console.error("Error fetching users in server:", error);
    }
  }

  async function fetchChannelsInServer(serverId) {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/servers/${serverId}/channels`,
        { withCredentials: true }
      );
      setChannelsInServer(res.data.channels);
    } catch (error) {
      console.error("Error fetching channels in server:", error);
    }
  }

  async function handleDeleteServer(serverId) {
    if (confirm("Are you sure you want to delete this server? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:8000/api/servers/${serverId}`, {
          withCredentials: true,
        });
        setServers((prev) => prev.filter((s) => s._id !== serverId));
        setSelectedServer(null);
      } catch (error) {
        console.error("Error deleting server:", error);
      }
    }
  }

  async function handleRemoveUser(userId) {
    if (confirm("Are you sure you want to remove this user from the server?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/servers/${selectedServer._id}/removeUser/${userId}`,
          { withCredentials: true }
        );
        setUsersInServer((prev) => prev.filter((u) => u._id !== userId));
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  }

  async function handleRemoveChannel(channelId) {
    if (confirm("Are you sure you want to remove this channel from the server?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/servers/${selectedServer._id}/channel/${channelId}`,
          { withCredentials: true }
        );
        setChannelsInServer((prev) => prev.filter((c) => c._id !== channelId));
      } catch (error) {
        console.error("Error removing channel:", error);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Search servers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Server Count */}
      <div className="bg-gray-800 rounded-lg p-4 flex items-center">
        <div className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 mr-4">
          <Server size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Servers</p>
          <p className="text-xl font-bold">{servers.length}</p>
        </div>
      </div>

      {/* Servers List */}
      <div>
        {filteredServers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServers.map((server) => (
              <div
                key={server._id}
                onClick={() => handleServerClick(server)}
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl hover:bg-gray-750 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Server size={20} className="text-blue-400 mr-3" />
                      <h3 className="text-lg font-semibold text-white">
                        {server.name}
                      </h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Created: {new Date(server.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3 flex justify-between">
                  <div className="flex items-center text-sm text-blue-300">
                    <Users size={16} className="mr-1" />
                    <span>View Details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center bg-gray-800/50 p-6 rounded-lg">
            No servers found.
          </p>
        )}
      </div>

      {/* Server Details Modal */}
      {selectedServer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
          <div 
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-3xl w-[90%] shadow-2xl relative overflow-hidden animate-modalFadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {selectedServer.name}
              </h3>
              <button
                onClick={handleCloseModal}
                className="bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors duration-200"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="text-sm text-gray-400 mb-6 flex items-center">
                <span>Created: {new Date(selectedServer.createdAt).toLocaleDateString()}</span>
                <span className="inline-block w-1 h-1 bg-gray-500 rounded-full mx-2"></span>
                <span>ID: {selectedServer._id}</span>
              </div>

              {/* Users List */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  <Users size={18} className="mr-2" />
                  Users ({usersInServer.length})
                </h4>
                <div className="bg-gray-800/50 rounded-lg">
                  {usersInServer.length > 0 ? (
                    <ul className="divide-y divide-gray-700">
                      {usersInServer.map((user) => (
                        <li
                          key={user._id}
                          className="flex justify-between items-center p-3 hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            <User size={16} className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium">{user.username}</div>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveUser(user._id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 rounded-md transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 p-3">No users in this server.</p>
                  )}
                </div>
              </div>

              {/* Channels List */}
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                  <MessageSquare size={18} className="mr-2" />
                  Channels ({channelsInServer.length})
                </h4>
                <div className="bg-gray-800/50 rounded-lg">
                  {channelsInServer.length > 0 ? (
                    <ul className="divide-y divide-gray-700">
                      {channelsInServer.map((channel) => (
                        <li
                          key={channel._id}
                          className="flex justify-between items-center p-3 hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            <MessageSquare size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm font-medium">{channel.name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveChannel(channel._id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 rounded-md transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 p-3">No channels in this server.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-850 border-t border-gray-700 px-6 py-4 flex justify-end">
              <button
                onClick={() => handleDeleteServer(selectedServer._id)}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Server
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllServers;