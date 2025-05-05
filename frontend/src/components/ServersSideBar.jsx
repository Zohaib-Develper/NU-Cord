import React from "react";
import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaHashtag, FaVolumeUp } from "react-icons/fa";

const ServersSideBar = ({ servers, setSelectedChannel }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleServerClick = (server) => {
    setSelectedItem(selectedItem?._id === server._id ? null : server);
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel({ ...channel, type: 'server' });
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const renderChannelList = (channels, type) => {
    return channels.map((channel, i) => (
      <p
        key={channel._id || i}
        className="ml-2 text-gray-300 cursor-pointer hover:text-white flex items-center gap-2"
        onClick={() => handleChannelClick(channel)}
      >
        {type === 'text' ? <FaHashtag className="text-xs" /> : <FaVolumeUp className="text-xs" />}
        {channel.name}
      </p>
    ));
  };

  const renderCategory = (title, channels, type) => {
    const isExpanded = expandedCategories[title];
    return (
      <div className="mb-2">
        <div 
          className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-gray-300"
          onClick={() => toggleCategory(title)}
        >
          {isExpanded ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
          <span className="text-sm font-semibold">{title}</span>
        </div>
        {isExpanded && (
          <div className="ml-4 mt-1">
            {renderChannelList(channels, type)}
          </div>
        )}
      </div>
    );
  };

  const getProfilePicUrl = (pfp) => {
    if (!pfp) return '';
    if (pfp.startsWith('/uploads/')) {
      return `http://localhost:8000${pfp}`;
    }
    return pfp;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Joined Servers</h2>
      {servers && servers.length > 0 ? (
        servers.map((server, index) => (
          <div key={server._id || index} className="mb-3">
            <button
              className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
              onClick={() => handleServerClick(server)}
            >
              {server.name}
            </button>
            {selectedItem?._id === server._id && server.channels && (
              <div className="ml-4 mt-2">
                {renderCategory(
                  "Text Channels",
                  server.channels.filter(channel => !channel.name.toLowerCase().includes('voice') && !channel.name.toLowerCase().includes('study')),
                  'text'
                )}
                {renderCategory(
                  "Voice Channels",
                  server.channels.filter(channel => channel.name.toLowerCase().includes('voice') || channel.name.toLowerCase().includes('study')),
                  'voice'
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No servers joined yet.</p>
      )}
    </div>
  );
};

export default ServersSideBar;
