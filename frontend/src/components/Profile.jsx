import React, { useState } from "react";
import ProfileImage from "../assets/profile.jpeg";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import axios from "axios";
import DefaultProfile from "../assets/me.png";

const Profile = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  const user = JSON.parse(localStorage.getItem("user"));

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");

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
      const res = await axios.post(
        `http://localhost:8000/api/friend/accept/${requesterId}`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
    } catch (error) {
      console.error(
        "Error accepting friend request:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white p-6 rounded-lg w-200 shadow-lg relative h-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <img
            src={user?.pfp || DefaultProfile}
            alt="Profile"
            className="w-28 h-28 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">{user.name}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-around mt-2 border-b border-gray-700 pb-2">
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
              activeTab === "friends"
                ? "border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "servers"
                ? "border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("servers")}
          >
            Servers
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "groups"
                ? "border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "friendrequests"
                ? "border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("friendrequests")}
          >
            Friends Requests
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "searchfriend"
                ? "border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("searchfriend")}
          >
            Search Friend
          </button>
        </div>

        {/* Content Sections */}
        <div className="mt-4 flex-grow pb-3">
          {activeTab === "info" && (
            <div>
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-gray-300 text-sm mt-2">
                Passionate about coding, problem-solving, and building scalable
                applications. Always learning and exploring new technologies.
              </p>
              <h3 className="text-lg font-semibold mt-2">Batch</h3>
              <p className="text-gray-300 text-sm ">{user?.batch}</p>
              <h3 className="text-lg font-semibold">Program</h3>
              <p className="text-gray-300 text-sm">{user?.degree_name}</p>
              <h3 className="text-lg font-semibold">Campus</h3>
              <p className="text-gray-300 text-sm">{user?.campus}</p>
            </div>
          )}

          {activeTab === "friends" && (
            <div>
              <h3 className="text-lg font-semibold">Friends</h3>
              <ul className="mt-2 space-y-3">
                {user?.friends?.length > 0 ? (
                  user.friends.map((friend) => (
                    <li
                      key={friend._id}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      <img
                        src={friend.pfp}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-gray-300 font-medium">
                        {friend.name}
                      </span>
                      <span>{friend.roll_no}</span>
                      <span>{friend.degree_name}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-300">No friends added yet</li>
                )}
                {/* </ul> */}

                {/* <li className="text-gray-300">John Doe</li>
                <li className="text-gray-300">Jane Doe</li>
                <li className="text-gray-300">Alice</li> */}
              </ul>
            </div>
          )}

          {activeTab === "servers" && (
            <div>
              <h3 className="text-lg font-semibold">Servers</h3>
              <ul className="mt-2">
                {user.servers.map((server) => {
                  return (
                    <li
                      key={server._id}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      {/* <img
                          src={server.pfp}
                          alt={server.name}
                          className="w-10 h-10 rounded-full object-cover"
                        /> */}
                      <span className="text-gray-300 font-medium">
                        {server.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {activeTab === "groups" && (
            <div>
              <h3 className="text-lg font-semibold">Groups</h3>
              <ul className="mt-2 space-y-3">
                {user.groups.length === 0 ? (
                  <li className="text-gray-300">No groups added yet</li>
                ) : (
                  user.groups.map((group) => (
                    <li
                      key={group._id}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      {/* <img
              src={group.pfp || "/images/default-group.png"}
              alt={group.name}
              className="w-10 h-10 rounded-full object-cover"
            /> */}
                      <span className="text-gray-300 font-medium">
                        {group.name}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {activeTab === "friendrequests" && (
            <div>
              <h3 className="text-lg font-semibold">Friend Requests</h3>
              <ul className="mt-2 space-y-3">
                {user.friendRequestsReceived.length === 0 ? (
                  <li className="text-gray-300">No friend requests yet</li>
                ) : (
                  user.friendRequestsReceived.map((f) => (
                    <li
                      key={f._id}
                      className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={f.pfp || "/images/userpfp.png"}
                          alt={f.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-gray-300 font-medium">
                          {f.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAcceptRequest(f._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Accept
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {activeTab === "searchfriend" && (
            <div>
              <h3 className="text-lg font-semibold">Search Friend</h3>
              <input
                type="text"
                placeholder="Search by name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-2 p-2 w-full bg-gray-800 text-gray-300 rounded-md"
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm mt-2"
                onClick={handleSearchFriend}
              >
                Search
              </button>

              <div className="mt-4 space-y-3">
                {searchError && <p className="text-red-500">{searchError}</p>}

                {searchResults.length > 0 &&
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 bg-gray-800 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.pfp || "/images/userpfp.png"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-md"
                        onClick={() => handleSendFriendRequest(user._id)}
                      >
                        Send Request
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* if user wants to add social media icons to contact there they can choose and add accordingly */}
        <div className="flex justify-center gap-6 border-t border-gray-700 pt-4 mt-auto">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-gray-300 text-2xl hover:text-white" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-gray-300 text-2xl hover:text-white" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-gray-300 text-2xl hover:text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
