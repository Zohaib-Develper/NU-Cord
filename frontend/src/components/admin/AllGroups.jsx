import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Users, Search, ExternalLink, UserPlus, Calendar, Link, Shield } from "lucide-react";

function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroup, setExpandedGroup] = useState(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/groups/all", {
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

  const handleDelete = async (e, groupId) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:8000/api/groups/${groupId}`, {
          withCredentials: true,
        });
        setGroups(groups.filter((group) => group._id !== groupId));
        if (expandedGroup === groupId) {
          setExpandedGroup(null);
        }
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const toggleExpand = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const filteredGroups = groups.filter(
    (group) => group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar and Info */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="relative lg:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search groups by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-4 flex items-center lg:w-1/2">
          <div className="p-2 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 mr-3">
            <Users size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Groups</p>
            <p className="text-xl font-bold">{groups.length}</p>
          </div>
        </div>
      </div>

      {/* Groups List */}
      {filteredGroups.length > 0 ? (
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                expandedGroup === group._id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {/* Main group row - always visible */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => toggleExpand(group._id)}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        className="h-12 w-12 rounded-lg border-2 border-blue-500 object-cover"
                        src={
                          group.coverImageURL === "/images/batchpfp.png"
                            ? "https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg"
                            : group.coverImageURL
                        }
                        alt="Group cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                        <Shield size={12} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-blue-300 flex items-center">
                        <Shield size={12} className="mr-1" />
                        Admin: {group.admin?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-3 items-center">
                    <div className="text-center bg-indigo-900/40 px-3 py-2 rounded-lg border border-indigo-800">
                      <p className="text-xs font-medium text-indigo-300 flex items-center">
                        <Users size={12} className="mr-1" />
                        Members
                        <span className="ml-2 text-lg font-semibold text-white">
                          {group.users?.length || 0}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, group._id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedGroup === group._id && (
                <div className="px-4 pb-4 border-t border-gray-700 mt-2 pt-3 space-y-4 animate-expandDown">
                  {/* Members Section */}
                  <div>
                    <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
                      <UserPlus size={14} className="mr-1" />
                      Members:
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                      {group.users?.length > 0 ? (
                        group.users.map((user) => (
                          <span
                            key={user._id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-300 border border-indigo-700"
                          >
                            {user.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No members</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-sm">
                    <div className="flex items-center text-gray-400">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      <span>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      <Shield size={14} className="mr-1 text-gray-500" />
                      <span>
                        Join restriction:{" "}
                        <span className="capitalize text-blue-300">
                          {group.joining_restriction || "none"}
                        </span>
                      </span>
                    </div>
                    
                    {group.inviteURL && (
                      <div className="flex items-center text-gray-400">
                        <Link size={14} className="mr-1 text-gray-500" />
                        <span>
                          Invite:{" "}
                          <a
                            href={group.inviteURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline hover:text-blue-300 transition-colors inline-flex items-center"
                          >
                            Link
                            <ExternalLink size={12} className="ml-1" />
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/70 rounded-lg p-8 text-center">
          <Users size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg">No groups found</p>
          {searchTerm && (
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search term
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AllGroups;