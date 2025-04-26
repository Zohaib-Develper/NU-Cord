import React from "react";
import { useState } from "react";

const ServersSideBar = () => {
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

  const [selectedItem, setSelectedItem] = useState(null);

  return (
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
  );
};

export default ServersSideBar;
