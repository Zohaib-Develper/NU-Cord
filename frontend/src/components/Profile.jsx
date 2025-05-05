import React, { useState, useEffect } from "react";
import ProfileImage from "../assets/profile.jpeg";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import DefaultProfile from "../assets/me.png";
import { useAuth } from "../utils/AuthContext";

const Profile = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [servers, setServers] = useState([]);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");

  const { login } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [newAbout, setNewAbout] = useState(user?.about || "");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Add state for socials editing
  const [editSocials, setEditSocials] = useState(false);
  const [socials, setSocials] = useState(user?.socials || { github: '', linkedin: '', instagram: '' });
  const [newSocials, setNewSocials] = useState(socials);
  const [isSavingSocials, setIsSavingSocials] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/groups", {
          withCredentials: true
        });
        if (response.data && response.data.groups) {
          setGroups(response.data.groups);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/friend", {
          withCredentials: true
        });
        if (response.data && response.data.friends) {
          setFriends(response.data.friends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/friend/requests", {
          withCredentials: true
        });
        if (response.data && response.data.requests) {
          setFriendRequests(response.data.requests);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    const fetchServers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/servers", {
          withCredentials: true
        });
        if (response.data && response.data.servers) {
          setServers(response.data.servers);
        }
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    fetchGroups();
    fetchFriends();
    fetchFriendRequests();
    fetchServers();
  }, []);

  async function handleSearchFriend() {
    if (!query.trim()) return;

    try {
      console.log("Searching for:", query);

      const res = await axios.get(`http://localhost:8000/api/user/search`, {
        params: { name: query },
        withCredentials: true,
      });
      console.log("Search results:", res);

      setSearchResults(res.data);
      setSearchError("");
    } catch (err) {
      console.error("Axios search error:", err);
      setSearchResults([]);
      setSearchError("No users found");
    }
  }

  const handleSendFriendRequest = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/friend/send/${receiverId}`,
        {},
        { withCredentials: true }
      );
      console.log("✅ Friend request sent:", res.data.message);
    } catch (error) {
      console.error(
        "❌ Error sending friend request:",
        error.response?.data || error.message
      );
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/friend/accept/${requesterId}`,
        {},
        { withCredentials: true }
      );
      // Refresh friend requests after accepting
      const response = await axios.get("http://localhost:8000/api/friend/requests", {
        withCredentials: true
      });
      if (response.data && response.data.requests) {
        setFriendRequests(response.data.requests);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("about", newAbout);
    if (newProfilePic) formData.append("pfp", newProfilePic);
    try {
      const res = await axios.put(
        "http://localhost:8000/user/profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      login(res.data.user); // update context and localStorage
      setEditMode(false);
      setNewProfilePic(null);
      setUser(res.data.user);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSocials = async () => {
    setIsSavingSocials(true);
    try {
      const res = await axios.put(
        "http://localhost:8000/user/profile",
        { socials: newSocials },
        { withCredentials: true }
      );
      login(res.data.user);
      setUser(res.data.user);
      setSocials(res.data.user.socials);
      setEditSocials(false);
    } catch (err) {
      alert("Failed to update socials");
    } finally {
      setIsSavingSocials(false);
    }
  };

  const getProfilePicUrl = (pfp) => {
    if (!pfp) return DefaultProfile;
    if (pfp.startsWith('/uploads/')) {
      return `http://localhost:8000${pfp}`;
    }
    return pfp;
  };

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white p-8 rounded-2xl max-w-xl w-full shadow-2xl relative h-auto flex flex-col items-center mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="relative mb-2">
            <img
              src={getProfilePicUrl(newProfilePic ? URL.createObjectURL(newProfilePic) : user?.pfp)}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
            />
            {editMode && (
              <label htmlFor="profile-pic-upload" className="absolute bottom-2 right-2 bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-600 border border-gray-500">
                <FaCamera className="text-white text-lg" />
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={e => setNewProfilePic(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-2">{user?.name}</h2>
          <p className="text-gray-400">{user?.username}</p>
          {activeTab === "info" && !editMode && (
            <button
              className="bg-[#6219EC] px-4 py-1 rounded mt-3 hover:bg-[#6B2DB3] transition font-semibold"
              onClick={() => {
                setEditMode(true);
                setNewAbout(user?.about || "");
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-around mt-6 border-b border-gray-700 pb-2 w-full">
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "info" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("info")}
          >
            User Info
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "friends" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "friendrequests" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("friendrequests")}
          >
            Friend Requests
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "groups" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "servers" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("servers")}
          >
            Servers
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "socials" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("socials")}
          >
            Socials
          </button>
        </div>

        {/* Content Sections */}
        <div className="mt-6 w-full">
          {activeTab === "info" && (
            <>
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-1">About</h3>
                {editMode ? (
                  <>
                    <textarea
                      className="text-gray-300 text-sm mt-2 bg-gray-900 p-3 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
                      value={newAbout}
                      maxLength={300}
                      rows={4}
                      onChange={e => setNewAbout(e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">{newAbout.length}/300</span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        className={`bg-green-600 px-4 py-2 rounded font-semibold text-white hover:bg-green-700 transition flex items-center justify-center ${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        ) : null}
                        Save
                      </button>
                      <button
                        className="bg-gray-600 px-4 py-2 rounded font-semibold text-white hover:bg-gray-700 transition"
                        onClick={() => setEditMode(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300 text-sm mt-2 whitespace-pre-line">{user?.about}</p>
                )}
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 w-full">
                <div>
                  <h3 className="text-lg font-semibold">Batch</h3>
                  <p className="text-gray-300 text-sm ">{user?.batch}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Program</h3>
                  <p className="text-gray-300 text-sm">{user?.degree_name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Campus</h3>
                  <p className="text-gray-300 text-sm">{user?.campus}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "friends" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Friends</h3>
              <ul className="mt-2">
                {friends.length > 0 ? (
                  friends.map((friend, idx) => (
                    <li
                      key={friend._id || idx}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <img src={getProfilePicUrl(friend.pfp)} alt="Friend" className="w-8 h-8 rounded-full" />
                      <span className="text-gray-300 font-medium">{friend.name}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No friends added yet</li>
                )}
              </ul>
            </div>
          )}

          {activeTab === "friendrequests" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
              <ul className="mt-2">
                {friendRequests.length > 0 ? (
                  friendRequests.map((request, idx) => (
                    <li
                      key={request._id || idx}
                      className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <span className="text-gray-300 font-medium">{request.name}</span>
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                      >
                        Accept
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No friend requests</li>
                )}
              </ul>
            </div>
          )}

          {activeTab === "groups" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Groups</h3>
              <ul className="mt-2">
                {groups.length > 0 ? (
                  groups.map((group, idx) => (
                    <li
                      key={group._id || idx}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <span className="text-gray-300 font-medium">{group.name}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No groups joined yet</li>
                )}
              </ul>
            </div>
          )}

          {activeTab === "servers" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Servers</h3>
              <ul className="mt-2">
                {servers.length > 0 ? (
                  servers.map((server, idx) => (
                    <li
                      key={server._id || idx}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <span className="text-gray-300 font-medium">{server.name}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No servers joined yet</li>
                )}
              </ul>
            </div>
          )}

          {activeTab === "socials" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Socials</h3>
              {editSocials ? (
                <>
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-1">GitHub</label>
                    <input
                      type="url"
                      className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
                      value={newSocials.github}
                      onChange={e => setNewSocials({ ...newSocials, github: e.target.value })}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
                      value={newSocials.linkedin}
                      onChange={e => setNewSocials({ ...newSocials, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-1">Instagram</label>
                    <input
                      type="url"
                      className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
                      value={newSocials.instagram}
                      onChange={e => setNewSocials({ ...newSocials, instagram: e.target.value })}
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      className={`bg-green-600 px-4 py-2 rounded font-semibold text-white hover:bg-green-700 transition flex items-center justify-center ${isSavingSocials ? "opacity-60 cursor-not-allowed" : ""}`}
                      onClick={handleSaveSocials}
                      disabled={isSavingSocials}
                    >
                      {isSavingSocials ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      ) : null}
                      Save
                    </button>
                    <button
                      className="bg-gray-600 px-4 py-2 rounded font-semibold text-white hover:bg-gray-700 transition"
                      onClick={() => { setEditSocials(false); setNewSocials(socials); }}
                      disabled={isSavingSocials}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-semibold text-gray-300">GitHub:</span>
                    <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{socials.github}</a>
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-semibold text-gray-300">LinkedIn:</span>
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{socials.linkedin}</a>
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-semibold text-gray-300">Instagram:</span>
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{socials.instagram}</a>
                  </div>
                  <button
                    className="bg-[#6219EC] px-4 py-1 rounded mt-2 hover:bg-[#6B2DB3] transition font-semibold"
                    onClick={() => setEditSocials(true)}
                  >
                    Edit Socials
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 border-t border-gray-700 pt-4 mt-auto">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-gray-300 text-2xl hover:text-white" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-gray-300 text-2xl hover:text-white" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-gray-300 text-2xl hover:text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
