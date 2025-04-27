import React from "react";
import {
  FaThumbtack,
  FaQuestionCircle,
  FaPhone,
  FaVideo,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
} from "react-icons/fa";
import FriendsImage from "../assets/friends.png";

const ChannelPage = ({ selectedChannel }) => {
  return (
    <div className="max-w-280 bg-gray-900 text-white max-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-2xl font-bold">
          {selectedChannel ? `# ${selectedChannel.name}` : "Select a channel"}
        </h2>
        <div className="flex space-x-5">
          {selectedChannel && (
            <>
              <FaThumbtack className="text-xl cursor-pointer hover:text-gray-400" />
              <FaQuestionCircle className="text-xl cursor-pointer hover:text-gray-400" />
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedChannel ? (
          <div className="space-y-4">
            {/* Placeholder for messages */}
            <p className="text-gray-400">No messages yet in this channel</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Select a channel to start chatting</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      {selectedChannel && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <FaPaperclip className="text-xl cursor-pointer hover:text-gray-400" />
            <input
              type="text"
              placeholder={`Message #${selectedChannel.name}`}
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none"
            />
            <FaSmile className="text-xl cursor-pointer hover:text-gray-400" />
            <FaMicrophone className="text-xl cursor-pointer hover:text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
