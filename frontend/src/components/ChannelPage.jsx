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
const ChannelPage = ({ selectedChannel, selectedType }) => {
  return (
    <div className="w-280 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-2xl font-bold">
          {selectedType === "text"
            ? `# ${selectedChannel}`
            : `${selectedChannel}`}
        </h2>
        <div className="flex space-x-5">
          {selectedType === "text" ? (
            <>
              <FaThumbtack className="text-xl cursor-pointer hover:text-gray-400" />
              <FaQuestionCircle className="text-xl cursor-pointer hover:text-gray-400" />
            </>
          ) : (
            <>
              <FaThumbtack className="text-xl cursor-pointer hover:text-gray-400" />
              <FaPhone className="text-xl cursor-pointer hover:text-gray-400" />
              <FaVideo className="text-xl cursor-pointer hover:text-gray-400" />
              <FaQuestionCircle className="text-xl cursor-pointer hover:text-gray-400" />
            </>
          )}
        </div>
      </div>

      {/* Messages Area (For now, placeholder content) */}
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-gray-300">
          {selectedType === "group"
            ? `Welcome to the ${selectedChannel} group chat. Feel free to discuss and collaborate here!`
            : selectedType === "dm"
            ? `You are now chatting with ${selectedChannel}. Send a message to start the conversation.`
            : `This is the ${selectedChannel} channel. Chat and share messages here.`}
        </p>
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center space-x-4">
        <FaPaperclip className="text-xl cursor-pointer hover:text-gray-400" />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none"
        />
        <FaSmile className="text-xl cursor-pointer hover:text-gray-400" />
        <FaMicrophone className="text-xl cursor-pointer hover:text-gray-400" />
      </div>
    </div>
  );
};

export default ChannelPage;
