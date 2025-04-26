import axios from "axios";
import { useEffect, useState } from "react";
import groupLogo from "../../assets/group.png";

function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await axios.get("http://localhost:8000/api/group/all", {
          withCredentials: true,
        });
        setGroups(res.data.groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  const handleDelete = async (groupId) => {
    try {
      await axios.delete(`http://localhost:8000/api/group/${groupId}`, {
        withCredentials: true,
      });
      setGroups(groups.filter((group) => group._id !== groupId));
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-700">
            {groups.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No groups found
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group._id}
                  className="px-4 py-5 sm:p-6 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center space-x-4">
                      <img
                        className="h-12 w-12 rounded-full border-2 border-blue-500"
                        src={
                          group.coverImageURL === "/images/batchpfp.png"
                            ? groupLogo
                            : group.coverImageURL
                        }
                        alt="Group cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {group.name}
                        </h3>
                        <p className="text-sm text-blue-300">
                          Admin: {group.admin?.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <div className="text-center bg-blue-900/50 px-3 py-2 rounded-lg">
                        <p className="text-xs font-medium text-blue-300">
                          Members : {"    "}
                          <span className="text-lg font-semibold text-white">
                            {group.users?.length || 0}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-blue-300 mb-2">
                      Members:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.users?.length > 0 ? (
                        group.users.map((user) => (
                          <span
                            key={user._id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-700"
                          >
                            {user.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No members</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center text-sm text-gray-400 gap-y-1">
                    <span>
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Join restriction:{" "}
                      <span className="capitalize text-blue-300">
                        {group.joining_restriction || "none"}
                      </span>
                    </span>
                    {group.inviteURL && (
                      <>
                        <span className="mx-2">•</span>
                        <span>
                          Invite URL:{" "}
                          <a
                            href={group.inviteURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline hover:text-blue-300 transition-colors"
                          >
                            Link
                          </a>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllGroups;
