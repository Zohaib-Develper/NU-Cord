import React, { useState, useContext } from "react";
import {
  FaComments,
  FaUserFriends,
  FaUser,
  FaCrown,
  FaSignOutAlt,
  FaPlus,
  FaCheck,
  FaTimes,
  FaLink,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaCog,
  FaCamera,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
import Profile from "../components/Profile";
import GroupSettingsModal from "./GroupSettingsModal";

const GroupsSideBar = ({ groups, setSelectedGroup, refreshGroups }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [adminApproval, setAdminApproval] = useState(false);
  const [creating, setCreating] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [error, setError] = useState("");
  const user = useContext(AuthContext)?.user;
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, group: null });
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showMainModal, setShowMainModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedGroupForSettings, setSelectedGroupForSettings] = useState(null);

  const handleGroupClick = (group) => {
    if (expandedGroup?.name === group.name) {
      setExpandedGroup(null);
      setShowMembers(false);
    } else {
      setExpandedGroup(group);
      setShowMembers(false);
      if (setSelectedGroup) {
        setSelectedGroup({ ...group, type: 'group' });
      }
    }
  };

  const handleShowMembers = () => {
    setShowMembers((prev) => !prev);
  };

  const getProfilePicUrl = (pfp) => {
    if (!pfp) return '';
    if (pfp.startsWith('/uploads/')) {
      return `http://localhost:8000${pfp}`;
    }
    return pfp;
  };

  const getGroupCoverUrl = (url) => {
    if (!url) return '/images/batchpfp.png';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", groupName);
      formData.append("description", description);
      formData.append("joining_restriction", adminApproval ? "adminApproval" : "allowed");
      if (coverImage) formData.append("file", coverImage);
      // coverImage is the file object
      const res = await axios.post(
        "http://localhost:8000/api/groups",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data && res.data.group && res.data.group.joining_code) {
        setInviteLink(res.data.group.joining_code);
        setShowInviteModal(true);
        if (refreshGroups) refreshGroups();
      }
      setShowCreateModal(false);
      setGroupName("");
      setDescription("");
      setCoverImage(null);
      setAdminApproval(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  // Context menu handler
  const handleContextMenu = (e, group) => {
    e.preventDefault();
    if (String(group.admin?._id || group.admin?.id || group.admin) === String(user._id)) {
      setContextMenu({ visible: true, x: e.clientX, y: e.clientY, group });
    }
  };
  const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, group: null });

  // Fetch join requests for a group
  const fetchJoinRequests = async (group) => {
    setRequestsLoading(true);
    setSelectedGroupId(group._id);
    try {
      // Find latest group data
      const res = await axios.get(`http://localhost:8000/api/groups` , { withCredentials: true });
      const found = res.data.groups.find(g => g._id === group._id);
      setRequests(found?.joining_requests || []);
      setShowRequestsModal(true);
    } catch {
      setRequests([]);
      setShowRequestsModal(true);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Approve join request
  const handleApprove = async (userId) => {
    await axios.post(`http://localhost:8000/api/groups/${selectedGroupId}/requests/${userId}/approve`, {}, { withCredentials: true });
    if (refreshGroups) refreshGroups();
    fetchJoinRequests({ _id: selectedGroupId });
  };
  // Reject join request
  const handleReject = async (userId) => {
    await axios.post(`http://localhost:8000/api/groups/${selectedGroupId}/requests/${userId}/reject`, {}, { withCredentials: true });
    if (refreshGroups) refreshGroups();
    fetchJoinRequests({ _id: selectedGroupId });
  };
  // Kick member
  const handleKick = async (groupId, userId) => {
    await axios.post(`http://localhost:8000/api/groups/${groupId}/kick/${userId}`, {}, { withCredentials: true });
    if (refreshGroups) refreshGroups();
  };
  // Leave group
  const handleLeave = async (groupId) => {
    await axios.delete(`http://localhost:8000/api/groups/${groupId}/leave`, { withCredentials: true });
    if (refreshGroups) refreshGroups();
  };
  // Delete group
  const handleDelete = async (groupId) => {
    await axios.delete(`http://localhost:8000/api/groups/${groupId}`, { withCredentials: true });
    if (refreshGroups) refreshGroups();
  };

  // Join group by code
  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setJoining(true);
    setJoinError("");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/groups/join",
        { code: joinCode },
        { withCredentials: true }
      );
      if (refreshGroups) refreshGroups();
      setShowJoinModal(false);
      setJoinCode("");
    } catch (err) {
      setJoinError(err.response?.data?.error || err.response?.data?.message || "Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div onClick={closeContextMenu} className="h-full">
      <div className="flex flex-col h-full min-h-0 bg-gray-900 text-white border-r border-gray-700">
        {/* Scrollable area for groups and members */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Joined Groups</h2>
            <button
              className="bg-[#7D3CDC] hover:bg-[#6a2eb8] text-white rounded-full p-2 ml-2 shadow-lg"
              title="Create or Join Group"
              onClick={() => setShowMainModal(true)}
            >
              <FaPlus />
            </button>
          </div>
          {/* Main Modal: Choose Create or Join */}
          {showMainModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-xs relative text-center">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => setShowMainModal(false)}
                >
                  <FaTimes />
                </button>
                <h3 className="text-xl font-bold mb-4">What would you like to do?</h3>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mb-3"
                  onClick={() => { setShowCreateModal(true); setShowMainModal(false); }}
                >
                  Create New Group
                </button>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                  onClick={() => { setShowJoinModal(true); setShowMainModal(false); }}
                >
                  Join Existing Group
                </button>
              </div>
            </div>
          )}
          {/* Join Group Modal */}
          {showJoinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => setShowJoinModal(false)}
                >
                  <FaTimes />
                </button>
                <h3 className="text-2xl font-bold mb-4 text-center">Join a Group</h3>
                <form onSubmit={handleJoinGroup} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-semibold">Enter Group Code</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value)}
                      required
                    />
                  </div>
                  {joinError && <div className="text-red-500 text-sm">{joinError}</div>}
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mt-2 disabled:opacity-50"
                    disabled={joining}
                  >
                    {joining ? "Joining..." : "Join Group"}
                  </button>
                </form>
              </div>
            </div>
          )}
          {/* Context Menu */}
          {contextMenu.visible && (
            <div
              className="fixed z-50 bg-gray-800 border border-gray-700 rounded shadow-lg py-2 px-4"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button
                className="block w-full text-left hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => { fetchJoinRequests(contextMenu.group); closeContextMenu(); }}
              >
                View Join Requests
              </button>
              <button
                className="block w-full text-left hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => { 
                  setSelectedGroupForSettings(contextMenu.group);
                  setShowSettingsModal(true);
                  closeContextMenu();
                }}
              >
                Group Settings
              </button>
              <button
                className="block w-full text-left hover:bg-gray-700 px-2 py-1 rounded text-red-500"
                onClick={() => { handleDelete(contextMenu.group._id); closeContextMenu(); }}
              >
                Delete Group
              </button>
            </div>
          )}
          {/* Join Requests Modal */}
          {showRequestsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => setShowRequestsModal(false)}
                >
                  <FaTimes />
                </button>
                <h3 className="text-2xl font-bold mb-4 text-center">Join Requests</h3>
                {requestsLoading ? (
                  <div className="text-center text-gray-400">Loading...</div>
                ) : requests.length === 0 ? (
                  <div className="text-center text-gray-400">No join requests.</div>
                ) : (
                  <ul>
                    {requests.map((user, idx) => (
                      <li key={user._id || user.id || user} className="flex items-center justify-between mb-2 bg-gray-800 p-2 rounded">
                        <span>{user.name}{user.username ? ` - ${user.username}` : ''}</span>
                        <span className="flex gap-2">
                          <button className="text-green-400 hover:text-green-600" onClick={() => handleApprove(user._id || user.id || user)}><FaCheck /></button>
                          <button className="text-red-400 hover:text-red-600" onClick={() => handleReject(user._id || user.id || user)}><FaTimes /></button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          {/* Create Group Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => setShowCreateModal(false)}
                >
                  <FaTimes />
                </button>
                <h3 className="text-2xl font-bold mb-4 text-center">Create a Group</h3>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-semibold">Group Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Description</label>
                    <textarea
                      className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Group Cover Image</label>
                    <div className="flex items-center gap-4">
                      <label htmlFor="group-cover-upload" className="cursor-pointer flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 border-2 border-dashed border-gray-600">
                        {coverImage ? (
                          <img
                            src={URL.createObjectURL(coverImage)}
                            alt="Group Cover Preview"
                            className="w-16 h-16 object-cover rounded-full"
                          />
                        ) : (
                          <FaCamera className="text-2xl text-gray-400" />
                        )}
                      </label>
                      <input
                        id="group-cover-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={e => setCoverImage(e.target.files[0])}
                      />
                      {coverImage && (
                        <button type="button" className="text-xs text-red-400 ml-2" onClick={() => setCoverImage(null)}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="adminApproval"
                      checked={adminApproval}
                      onChange={e => setAdminApproval(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="adminApproval" className="font-semibold">Admin Approval Required</label>
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-2 disabled:opacity-50"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Group"}
                  </button>
                </form>
              </div>
            </div>
          )}
          {/* Invite Code Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md relative text-center">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => setShowInviteModal(false)}
                >
                  <FaTimes />
                </button>
                <FaLink className="mx-auto text-3xl text-blue-400 mb-2" />
                <h3 className="text-xl font-bold mb-2">Group Code</h3>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2 text-center"
                  value={inviteLink}
                  readOnly
                  onClick={e => e.target.select()}
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => {navigator.clipboard.writeText(inviteLink);}}
                >
                  Copy Code
                </button>
              </div>
            </div>
          )}
          {/* Group Settings Modal */}
          {showSettingsModal && selectedGroupForSettings && (
            <GroupSettingsModal
              group={selectedGroupForSettings}
              onClose={() => {
                setShowSettingsModal(false);
                setSelectedGroupForSettings(null);
              }}
              onUpdate={() => {
                if (refreshGroups) refreshGroups();
              }}
            />
          )}
          {/* Existing Groups List */}
          {groups && groups.length > 0 ? (
            groups.map((group, index) => {
              const isAdmin = String(group.admin?._id || group.admin?.id || group.admin) === String(user._id);
              const isMember = group.users?.some(u => String(u._id || u.id || u) === String(user._id));
              return (
                <div key={index} className="mb-3" onContextMenu={e => handleContextMenu(e, group)}>
                  <button
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-600 flex items-center gap-3"
                    onClick={() => handleGroupClick(group)}
                  >
                    <img
                      src={getGroupCoverUrl(group.coverImageURL)}
                      alt="Group Cover"
                      className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-700"
                    />
                    {group.name}
                  </button>
                  {/* Show Chat + Members if group is expanded */}
                  {expandedGroup?.name === group.name && (
                    <div className="ml-4 mt-2">
                      <button
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-600 flex gap-3"
                        onClick={() => {
                          if (setSelectedGroup) setSelectedGroup({ ...group, type: 'group' }, "chat");
                        }}
                      >
                        <FaComments className="mt-1" />
                        Chat
                      </button>
                      <button
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-600 mt-1 flex gap-3"
                        onClick={handleShowMembers}
                      >
                        <FaUserFriends className="mt-1" />
                        Members
                      </button>
                      {/* Members List */}
                      {showMembers && (
                        <div className="ml-4 mt-2">
                          <h3 className="font-semibold">Members</h3>
                          {group.users &&
                            [...group.users]
                              .sort((a, b) => {
                                const adminId = String(group.admin?._id || group.admin?.id || group.admin);
                                const aId = String(a._id || a.id || a);
                                const bId = String(b._id || b.id || b);
                                if (aId === adminId) return -1;
                                if (bId === adminId) return 1;
                                return 0;
                              })
                              .map((userObj, i) => {
                                const adminId = String(group.admin?._id || group.admin?.id || group.admin);
                                const userId = String(userObj._id || userObj.id || userObj);
                                const isAdminUser = adminId === userId;
                                return (
                                  <div key={i} className="ml-2 mt-2 text-gray-300 flex gap-3 items-center justify-between">
                                    <span className="flex items-center gap-2">
                                      <img src={getProfilePicUrl(userObj.pfp)} alt="User" className="w-6 h-6 rounded-full mr-2" />
                                      {userObj.name || userId}
                                      {isAdminUser && (
                                        <span className="text-yellow-300 text-sm font-semibold ml-2">Admin</span>
                                      )}
                                    </span>
                                    <span className="flex gap-2">
                                      {isAdmin && !isAdminUser && (
                                        <button className="text-red-400 hover:text-red-600" title="Kick" onClick={() => handleKick(group._id, userId)}><FaSignOutAlt /></button>
                                      )}
                                      {!isAdminUser && String(user._id) === userId && (
                                        <button className="text-red-400 hover:text-red-600" title="Leave Group" onClick={() => handleLeave(group._id)}><FaSignOutAlt /></button>
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No groups joined yet.</p>
          )}
        </div>
        {/* User Profile Section pinned to bottom */}
        <div className="w-full bg-gray-900 text-white flex items-center justify-between h-16 p-4 border-t border-gray-800">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsProfileOpen(true)}>
            <img
              src={getProfilePicUrl(user?.pfp)}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.username}</p>
            </div>
          </div>
        </div>
        {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
      </div>
    </div>
  );
};

export default GroupsSideBar;
