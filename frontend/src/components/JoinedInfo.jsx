import React, { useState } from "react";
import ChannelPage from "../components/ChannelPage";

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
  dms: ["Mamoon-22", "JohnDoe", "JaneDoe"],
};

const JoinedInfo = ({ selectedCategory, setSelectedChannel, setSelectedType }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupSection, setSelectedGroupSection] = useState(null);

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
                onClick={() => setSelectedItem(selectedItem === server ? null : server)}
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
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                      onClick={() => {
                        setSelectedChannel(channel);
                        setSelectedType("voice");
                      }}
                    >
                      🔊 {channel}
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
                onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
              >
                {group.name}
              </button>
              {selectedGroup === group && (
                <div className="ml-4 mt-2">
                  <button
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
                    onClick={() => {
                      setSelectedChannel(group.name);
                      setSelectedType("group");
                    }}
                  >
                    💬 Chat
                  </button>
                  <button
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-600 mt-1"
                    onClick={() => setSelectedGroupSection(selectedGroupSection === "members" ? null : "members")}
                  >
                    👥 Members
                  </button>
                  {selectedGroupSection === "members" && (
                    <div className="ml-4 mt-2">
                      <h3 className="font-semibold">Members</h3>
                      {group.members.map((member, i) => (
                        <p key={i} className="ml-2 text-gray-300">👤 {member}</p>
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
      {selectedCategory === "dm" && (
        <div>
          <h2 className="text-xl font-bold mb-3">Direct Messages</h2>
          {dummyData.dms.map((dm, index) => (
            <p
              key={index}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 mb-3 cursor-pointer"
              onClick={() => {
                setSelectedChannel(dm);
                setSelectedType("dm");
              }}
            >
              ✉️ {dm}
            </p>
          ))}
        </div>
      )}
      
      {/* Profile Section */}
      <div className="w-full bg-gray-900 text-white mt-auto flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <img src="/path-to-profile-pic.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-gray-400">Batch 22</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-xl text-gray-400 hover:text-white">🎤</button>
          <button className="text-xl text-gray-400 hover:text-white">🎥</button>
        </div>
      </div>
    </div>
  );
};

export default JoinedInfo;
