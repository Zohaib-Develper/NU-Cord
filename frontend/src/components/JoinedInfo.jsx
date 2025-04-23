import React, { useContext, useState } from "react";
import ChannelPage from "../components/ChannelPage";
import ProfileImage from "../assets/profile.jpeg";
import Profile from "../components/Profile";
import FriendsProfile from "../assets/profile2.jpeg";
import {
  FaVideoSlash,
  FaMicrophoneSlash,
  FaVideo,
  FaMicrophone,
  FaComments,
  FaUserFriends,
  FaUser,
  FaVolumeUp,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import DirectMessages from "./DirectMessages";
const dummyData = {
  servers: [
    {
      name: "Batch 22",
      textChannels: ["general", "resources", "announcements"],
      voiceChannels: ["Study Room 1", "Study Room 2"],
    },
    {
      name: "Gaming Hub",
      textChannels: ["chat", "memes"],
      voiceChannels: ["Game Night 1", "Game Night 2"],
    },
  ],
  groups: [
    {
      name: "Project Team",
      members: ["Alice", "Bob", "Charlie"],
    },
    {
      name: "Study Buddies",
      members: ["David", "Eve", "Frank"],
    },
  ],
  dms: ["Abdul Rafay", "Zohaib Musharaf", "Chaand Ali"],
};

const JoinedInfo = ({
  selectedCategory,
  setSelectedChannel,
  setSelectedType,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupSection, setSelectedGroupSection] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useContext(AuthContext).user;
  return (
    <div className="flex flex-col w-80 h-screen bg-gray-800 text-white border-r-2 border-gray-600 p-4 overflow-y-auto">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4 outline-none"
      />

      {/* Server Section */}
      {selectedCategory === "server" && (
        <div>
          <h2 className="text-xl font-bold mb-3">Joined Servers</h2>
          {dummyData.servers.map((server, index) => (
            <div key={index} className="mb-3">
              <button
                className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
                onClick={() =>
                  setSelectedItem(selectedItem === server ? null : server)
                }
              >
                {server.name}
              </button>
              {selectedItem === server && (
                <div className="ml-4 mt-2">
                  <h3 className="font-semibold">Text Channels</h3>
                  {server.textChannels.map((channel, i) => (
                    <p
                      key={i}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                      onClick={() => {
                        setSelectedChannel(channel);
                        setSelectedType("text");
                      }}
                    >
                      # {channel}
                    </p>
                  ))}
                  <h3 className="font-semibold mt-2">Voice Channels</h3>
                  {server.voiceChannels.map((channel, i) => (
                    <p
                      key={i}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white flex gap-2"
                      onClick={() => {
                        setSelectedChannel(channel);
                        setSelectedType("voice");
                      }}
                    >
                      <FaVolumeUp className="mt-1"></FaVolumeUp> {channel}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Group Section */}
      {selectedCategory === "group" && (
        <div>
          <h2 className="text-xl font-bold mb-3">Joined Groups</h2>
          {dummyData.groups.map((group, index) => (
            <div key={index} className="mb-3">
              <button
                className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
                onClick={() =>
                  setSelectedGroup(selectedGroup === group ? null : group)
                }
              >
                {group.name}
              </button>
              {selectedGroup === group && (
                <div className="ml-4 mt-2">
                  <button
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-600 flex gap-3"
                    onClick={() => {
                      setSelectedChannel(group.name);
                      setSelectedType("group");
                    }}
                  >
                    <FaComments className="mt-1"></FaComments>
                    Chat
                  </button>
                  <button
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-600 mt-1 flex gap-3"
                    onClick={() =>
                      setSelectedGroupSection(
                        selectedGroupSection === "members" ? null : "members"
                      )
                    }
                  >
                    <FaUserFriends className="mt-1"></FaUserFriends> Members
                  </button>
                  {selectedGroupSection === "members" && (
                    <div className="ml-4 mt-2">
                      <h3 className="font-semibold">Members</h3>
                      {group.members.map((member, i) => (
                        <p
                          key={i}
                          className="ml-2 mt-2 text-gray-300 flex gap-3"
                        >
                          <FaUser className="text-sm mt-1"></FaUser>
                          {member}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Direct Messages */}
      {selectedCategory === "dm" && <DirectMessages />}

      {/* Profile Section */}
      <div className="w-full bg-gray-900 text-white mt-auto flex items-center justify-between h-14 p-4">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
        >
          <img
            src={user.pfp}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-400">{user.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`text-xl ${
              isMicMuted ? "text-red-600" : "text-white-500"
            } hover:text-white`}
            onClick={() => setIsMicMuted(!isMicMuted)}
          >
            {isMicMuted ? (
              <FaMicrophoneSlash className="text-xl cursor-pointer" />
            ) : (
              <FaMicrophone className="text-xl cursor-pointer" />
            )}
          </button>
          <button
            className={`text-xl ${
              isVideoOff ? "text-red-600" : "text-white-500"
            } hover:text-white`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? (
              <FaVideoSlash className="text-xl cursor-pointer" />
            ) : (
              <FaVideo className="text-xl cursor-pointer" />
            )}
          </button>
        </div>
      </div>
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default JoinedInfo;
