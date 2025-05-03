import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaThumbtack,
  FaQuestionCircle,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
  FaEllipsisV,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000");

const Chat = ({ selectedChannel }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const [fetched, setFetched] = useState(false);
  const { user } = useContext(AuthContext);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [selectedChannel, user._id]);

  useEffect(() => {
    setFetched(false);
    setMessages([]);
    if (!selectedChannel?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/chat/directmessages/${selectedChannel._id}`,
          { withCredentials: true }
        );
        setMessages(response.data);
        setFetched(true);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedChannel, user._id]);

  useEffect(() => {
    if (!fetched) return;

    const handleNewMessage = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };
    
    socket.on("receiveDirectMessage", handleNewMessage);
    return () => socket.off("receiveDirectMessage", handleNewMessage);
  }, [fetched]);

  useEffect(() => {
    const handleDeleteForEveryone = (updatedMessage) => {
      setMessages(prevMsgs => prevMsgs.map(msg =>
        msg._id === updatedMessage._id ? updatedMessage : msg
      ));
    };
    
    socket.on("messageDeletedForEveryone", handleDeleteForEveryone);
    return () => socket.off("messageDeletedForEveryone", handleDeleteForEveryone);
  }, []);

  useEffect(() => {
    if (selectedChannel?._id && user?._id) {
      socket.emit("joinDM", { userId: user._id, otherUserId: selectedChannel._id });
    }
  }, [selectedChannel, user._id]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    try {
      await axios.post(
        "http://localhost:8000/api/chat/send",
        {
          text: inputValue,
          receiverId: selectedChannel._id,
        },
        { withCredentials: true }
      );
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDeleteMessage = async (messageId, deleteType) => {
    try {
      if (deleteType === "everyone") {
        socket.emit("deleteDirectMessageForEveryone", {
          messageId,
          senderId: user._id,
          receiverId: selectedChannel._id,
        });
      } else {
        await axios.delete(
          `http://localhost:8000/api/chat/message/${messageId}/forme`,
          { withCredentials: true }
        );
        setMessages(prev => prev.filter((msg) => msg._id !== messageId));
      }
      setShowDeleteMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="h-full max-w-280 bg-gray-900 text-white flex flex-col">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChannel ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex flex-col ${
                  (msg.sender && msg.sender._id === user._id) ? "items-end" : "items-start"
                }`}
              >
                <span className="text-sm text-gray-400 mb-1">
                  {(msg.sender && msg.sender._id === user._id) ? "You" : selectedChannel.name}
                </span>

                <div className="relative group">
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      (msg.sender && msg.sender._id === user._id) ? "bg-blue-600" : "bg-gray-700"
                    } text-white`}
                  >
                    {msg.deleteFromEveryone ? (
                      <span className="italic text-gray-400">This message was deleted</span>
                    ) : (
                      msg.text
                    )}
                  </div>
                  {(msg.sender && msg.sender._id === user._id) && (
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setShowDeleteMenu(msg._id)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <FaEllipsisV />
                      </button>
                    </div>
                  )}
                  {showDeleteMenu === msg._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-8 bg-gray-800 rounded-lg shadow-lg py-2 w-48 z-10"
                    >
                      <button
                        onClick={() => handleDeleteMessage(msg._id, "me")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                      >
                        Delete for me
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg._id, "everyone")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                      >
                        Delete for everyone
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Select a channel to start chatting</p>
          </div>
        )}
      </div>

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
