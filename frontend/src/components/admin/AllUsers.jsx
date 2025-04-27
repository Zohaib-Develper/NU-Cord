import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";

function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:8000/user/all", {
          withCredentials: true,
        });
        setUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  async function handleRemoveUser(userId) {
    try {
      await axios.delete(`http://localhost:8000/user/${userId}`, {
        withCredentials: true,
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error removing user:", error);
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

  const activeUsers = users.filter((user) => !user.isSuspended);
  const suspendedUsers = users.filter((user) => user.isSuspended);

  return (
    <div className="p-6">

      {/* Active Users Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-green-400 mb-4">
          Active Users
        </h3>
        {activeUsers.length > 0 ? (
          <ul className="space-y-4">
            {activeUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center bg-gray-800 p-3 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <img
                  src={user.pfp}
                  alt={`${user.name}'s profile`}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-md font-medium text-gray-100 truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSuspendUser(user._id)}
                    className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg shadow transition"
                  >
                    <FaBan size={12} />
                    Suspend
                  </button>
                  <button
                    onClick={() => handleRemoveUser(user._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg shadow transition"
                  >
                    <FaTrash size={12} />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No active users found.</p>
        )}
      </section>

      {/* Suspended Users Section */}
      <section>
        <h3 className="text-2xl font-semibold text-red-400 mb-4">
          Suspended Users
        </h3>
        {suspendedUsers.length > 0 ? (
          <ul className="space-y-4">
            {suspendedUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center bg-gray-700 p-3 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <img
                  src={user.pfp}
                  alt={`${user.name}'s profile`}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-md font-medium text-gray-100 truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUnsuspendUser(user._id)}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg shadow transition"
                  >
                    <FaCheckCircle size={12} />
                    Unsuspend
                  </button>
                  <button
                    onClick={() => handleRemoveUser(user._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg shadow transition"
                  >
                    <FaTrash size={12} />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No suspended users found.</p>
        )}
      </section>
    </div>
  );
}

export default AllUsers;
