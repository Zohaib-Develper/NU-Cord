import axios from "axios";
import { useEffect, useState } from "react";

function AllServers() {
  const [servers, setServers] = useState([]);
  const [usersInServer, setUsersInServer] = useState([]);
  const [channelsInServer, setChannelsInServer] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    async function fetchServers() {
      try {
        const res = await axios.get("http://localhost:8000/api/server/", {
          withCredentials: true,
        });
        setServers(res.data.servers);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    }
    fetchServers();
  }, []);

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
        `http://localhost:8000/api/server/${serverId}/users`,
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
        `http://localhost:8000/api/server/${serverId}/channels`,
        { withCredentials: true }
      );
      setChannelsInServer(res.data.channels);
    } catch (error) {
      console.error("Error fetching channels in server:", error);
    }
  }

  async function handleDeleteServer(serverId) {
    if (confirm("Are you sure you want to delete this server?")) {
      try {
        await axios.delete(`http://localhost:8000/api/server/${serverId}`, {
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
    if (confirm("Remove this user from the server?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/server/${selectedServer._id}/removeUser/${userId}`,
          { withCredentials: true }
        );
        setUsersInServer((prev) => prev.filter((u) => u._id !== userId));
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  }

  async function handleRemoveChannel(channelId) {
    if (confirm("Remove this channel from the server?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/server/${selectedServer._id}/channel/${channelId}`,
          { withCredentials: true }
        );
        setChannelsInServer((prev) => prev.filter((c) => c._id !== channelId));
      } catch (error) {
        console.error("Error removing channel:", error);
      }
    }
  }

  return (
    <div className="p-4">
      {servers.length > 0 ? (
        <ul className="space-y-5">
          {servers.map((server) => (
            <li
              key={server._id}
              className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-transform transform duration-200 cursor-pointer"
              onClick={() => handleServerClick(server)}
            >
              <h3 className="text-lg font-semibold text-white">
                {server.name}
              </h3>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No servers found</p>
      )}

      {/* Modal */}
      {selectedServer && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-[90%] max-w-3xl shadow-2xl relative overflow-y-auto max-h-[90vh] animate-fade-in">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">
              {selectedServer.name}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Created At:{" "}
              {new Date(selectedServer.createdAt).toLocaleDateString()}
            </p>

            {/* Users List */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-indigo-300 mb-3">
                Users :
              </h4>
              {usersInServer.length > 0 ? (
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {usersInServer.map((user) => (
                    <li
                      key={user._id}
                      className="flex justify-between items-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {user.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {user.email}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs px-3 py-1 rounded-md transition-all duration-200"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No users found.</p>
              )}
            </div>

            {/* Channels List */}
            <div>
              <h4 className="text-lg font-semibold text-indigo-300 mb-3">
                Channels :
              </h4>
              {channelsInServer.length > 0 ? (
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {channelsInServer.map((channel) => (
                    <li
                      key={channel._id}
                      className="bg-gray-800 p-3 rounded-lg text-sm flex justify-between items-center hover:bg-gray-700 transition-all duration-200"
                    >
                      <span className="font-semibold">{channel.name}</span>
                      <button
                        onClick={() => handleRemoveChannel(channel._id)}
                        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs px-3 py-1 rounded-md transition-all duration-200"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No channels found.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => handleDeleteServer(selectedServer._id)}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
              >
                Delete Server
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllServers;
