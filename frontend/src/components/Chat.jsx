import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaThumbtack,
  FaQuestionCircle,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
  FaEllipsisV,
  FaFile,
  FaImage,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:8000");

const Chat = ({ selectedChannel }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useContext(AuthContext);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      sendMessage(file);
    }
  };

  const sendMessage = async (file = null) => {
    if (!selectedChannel || !selectedChannel._id) {
      alert('No recipient selected!');
      return;
    }
    if (!inputValue.trim() && !file) return;
    try {
      const formData = new FormData();
      formData.append('text', inputValue);
      formData.append('receiverId', selectedChannel._id);
      if (file) {
        formData.append('file', file);
      }
      await axios.post(
        "http://localhost:8000/api/chat/send",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setInputValue("");
      setSelectedFile(null);
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

  const handleEmojiClick = (emojiObject) => {
    setInputValue(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <FaImage className="text-blue-500" />;
    }
    return <FaFile className="text-gray-400" />;
  };

  // Voice note recording logic
  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorder) mediaRecorder.stop();
      setIsRecording(false);
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('Audio tracks:', stream.getAudioTracks());
          let mimeType = 'audio/ogg;codecs=opus';
          if (!window.MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/webm;codecs=opus';
          }
          if (!window.MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/webm';
          }
          if (!window.MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
          console.log('Using MediaRecorder mimeType:', mimeType);
          const recorder = new window.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
          let localChunks = [];
          recorder.ondataavailable = (e) => {
            console.log('Chunk size:', e.data.size, 'type:', e.data.type);
            if (e.data.size > 0) localChunks.push(e.data);
          };
          recorder.onstop = () => {
            setTimeout(() => {
              if (localChunks.length > 0) {
                const audioBlob = new Blob(localChunks, { type: mimeType || 'audio/webm' });
                const audioFile = new File([audioBlob], `voice-note-${Date.now()}.${mimeType.includes('ogg') ? 'ogg' : 'webm'}`, { type: mimeType || 'audio/webm' });
                console.log('Final audio file:', audioFile);
                sendMessage(audioFile);
              } else {
                console.warn('No audio chunks collected!');
              }
              localChunks = [];
            }, 0);
          };
          recorder.start();
          setMediaRecorder(recorder);
          setIsRecording(true);
        } catch (err) {
          alert('Microphone access denied or not available.');
        }
      } else {
        alert('Audio recording not supported in this browser.');
      }
    }
  };

  useEffect(() => {
    // Clean up media recorder on unmount
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    };
    // eslint-disable-next-line
  }, []);

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
                  {(() => {
                    const isImage = msg.fileUrl && ["jpg", "jpeg", "png", "gif"].includes(msg.fileName?.split('.').pop().toLowerCase());
                    const isAudio = msg.fileUrl && ["mp3", "wav", "ogg", "webm"].includes(msg.fileName?.split('.').pop().toLowerCase());
                    // Audio message
                    if (isAudio) {
                      const ext = msg.fileName?.split('.').pop().toLowerCase();
                      return (
                        <div
                          className={`rounded-2xl shadow px-0 py-2 my-1 flex flex-col max-w-lg ${
                            (msg.sender && msg.sender._id === user._id)
                              ? 'ml-auto'
                              : 'mr-auto'
                          }`}
                          style={{ minWidth: 260, maxWidth: 400, background: 'transparent', boxShadow: 'none' }}
                        >
                          <audio
                            controls
                            className="w-full outline-none"
                            style={{ minWidth: 220, height: 40 }}
                          >
                            <source src={`http://localhost:8000${msg.fileUrl}`} type={`audio/${ext === 'mp3' ? 'mpeg' : ext}`} />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      );
                    }
                    // Image-only message
                    if (isImage && !msg.text) {
                      return (
                        <div className="mt-2">
                          <a
                            href={`http://localhost:8000${msg.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`http://localhost:8000${msg.fileUrl}`}
                              alt={msg.fileName}
                              className="rounded-lg border border-gray-700 shadow max-w-[200px] max-h-[200px] transition-transform hover:scale-105"
                              style={{ display: 'block' }}
                            />
                          </a>
                        </div>
                      );
                    }
                    // Image with text
                    if (isImage && msg.text) {
                      return (
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          (msg.sender && msg.sender._id === user._id) ? "bg-[#3a2257]" : "bg-gray-700"
                        } text-white`}>
                          <div className="mb-2">
                            <a
                              href={`http://localhost:8000${msg.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`http://localhost:8000${msg.fileUrl}`}
                                alt={msg.fileName}
                                className="rounded-lg border border-gray-700 shadow max-w-[200px] max-h-[200px] transition-transform hover:scale-105"
                                style={{ display: 'block' }}
                              />
                            </a>
                          </div>
                          {msg.text}
                        </div>
                      );
                    }
                    // Non-image file or text-only
                    return (
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        (msg.sender && msg.sender._id === user._id) ? "bg-[#3a2257]" : "bg-gray-700"
                      } text-white`}>
                        {msg.deleteFromEveryone ? (
                          <span className="italic text-gray-400">This message was deleted</span>
                        ) : (
                          <>
                            {msg.text}
                            {msg.fileUrl && (
                              <div className="mt-2 flex items-center space-x-2">
                                {getFileIcon(msg.fileName)}
                                <a
                                  href={`http://localhost:8000${msg.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-300 hover:text-blue-200"
                                >
                                  {msg.fileName}
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })()}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <FaPaperclip 
              className="text-xl cursor-pointer hover:text-gray-400" 
              onClick={() => fileInputRef.current.click()}
            />
            <input
              type="text"
              placeholder={`Message #${selectedChannel.name}`}
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="relative" ref={emojiPickerRef}>
              <FaSmile 
                className="text-xl cursor-pointer hover:text-gray-400" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div className="absolute bottom-10 right-0 z-50">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                    theme="dark"
                  />
                </div>
              )}
            </div>
            <FaMicrophone
              className={`text-xl cursor-pointer hover:text-gray-400 ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
              onClick={handleMicClick}
              title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
