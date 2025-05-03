import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaThumbtack,
  FaQuestionCircle,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000");

const Chat = ({ selectedChannel }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/chat/directmessages/${selectedChannel._id}`,
        { withCredentials: true }
      );
      setMessages(response.data);
    };
    if (selectedChannel._id) {
      fetchMessages();
      socket.emit("registerUser", user._id);
      socket.on("receiveDirectMessage", ({ senderId, text }) => {
        setMessages((prev) => [...prev, { sender: senderId, text: text }]);
      });

      return () => {
        socket.off("diconnect");
      };
    }
  }, [selectedChannel]);

  const sendMessage = () => {
    socket.emit("sendDirectMessage", {
      text: inputValue,
      receiverId: selectedChannel._id,
      senderId: user._id,
    });

    setMessages((prev) => [...prev, { sender: user._id, text: inputValue }]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="h-full max-w-280 bg-gray-900 text-white flex flex-col">
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
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChannel ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === user._id ? "items-end" : "items-start"
              }`}
            >
              {/* Sender name */}
              <span className="text-sm text-gray-400 mb-1">
                {msg.sender === user._id ? "You" : selectedChannel.name}
              </span>

              {/* Message bubble */}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === user._id ? "bg-blue-600" : "bg-gray-700"
                } text-white`}
              >
                {msg.text}
              </div>
            </div>
          ))
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <FaSmile className="text-xl cursor-pointer hover:text-gray-400" />
            <FaMicrophone className="text-xl cursor-pointer hover:text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
