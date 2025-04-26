import React from "react";
import { useState } from "react";

const ServersSideBar = ({ servers, setSelectedChannel }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Joined Servers</h2>
      {servers.map((server, index) => (
        <div key={index} className="mb-3">
          <button
            className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
            onClick={() =>
              setSelectedItem(selectedItem.id === server.id ? null : server)
            }
          >
            {server.name}
          </button>
          {selectedItem.id === server.id && (
            <div className="ml-4 mt-2">
              {server.channels.map((channel, i) => (
                <p
                  key={i}
                  className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                  onClick={() => {
                    setSelectedChannel(channel);
                  }}
                >
                  # {channel}
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
