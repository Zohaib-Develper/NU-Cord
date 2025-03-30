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
  if (!selectedChannel) {
    return (
      <div className="w-280 bg-gray-800 text-white h-screen p-2 flex flex-col items-center justify-center">
        <div className="space-y-4 flex flex-col items-center w-full ">
          <div className="p-2 w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer ">
            <h3 className="text-lg font-semibold">Invite your friends</h3>
          </div>
          <div className="p-2 w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer">
            <h3 className="text-lg font-semibold">
              Say Hi to your class fellows
            </h3>
          </div>
          <div className="p-2 w-2/3 bg-[#5e17eb] text-center rounded-lg shadow-md hover:opacity-80 cursor-pointer">
            <h3 className="text-lg font-semibold">
              Study together for your exams
            </h3>
          </div>
        </div>

        <div className="flex items-center mt-10 gap-30">
          <img
            src={FriendsImage}
            alt="Chatting"
            className="w-80 rounded-lg mb-4"
          />
          <h2 className="text-8xl font-bold text-center">
            Happy <br />
            Chatting!
          </h2>
        </div>
      </div>
    );
  }

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
