import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaThumbtack,
  FaQuestionCircle,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
  FaMicrophoneSlash,
  FaEllipsisV,
  FaFile,
  FaImage,
  FaLock,
  FaVideo,
  FaVideoSlash,
  FaPhone,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import VoiceChannelCard from "./VoiceChannelCard";
import Tooltip from "@mui/material/Tooltip";
import { AlertCircle } from "lucide-react";

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
  const prevMessagesLength = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [showSuspendedMessage, setShowSuspendedMessage] = useState(false);

  // Add new state variables for calling
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callType, setCallType] = useState(null); // 'video' or 'voice'
  const [caller, setCaller] = useState(null);
  const [callOffer, setCallOffer] = useState(null);
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // Mute/camera state
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [socketConnected, setSocketConnected] = useState(socket.connected);

  const isAnnouncementChannel = selectedChannel?.name?.toLowerCase().includes('announcement');
  const isAdmin = user?.role === 'ADMIN';
  const canSendMessages = !isAnnouncementChannel || isAdmin;

  // Detect if selectedChannel is a voice channel
  const isVoiceChannel = selectedChannel && (selectedChannel.name?.toLowerCase().includes('voice') || selectedChannel.name?.toLowerCase().includes('study'));
  // Placeholder: users in channel (should be fetched from backend in real app)
  const usersInChannel = [user];

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
        let response;
        if (selectedChannel.type === 'group') {
          response = await axios.get(
            `http://localhost:8000/api/chat/groupmessages/${selectedChannel._id}`,
            { withCredentials: true }
          );
        } else if (selectedChannel.type === 'server') {
          response = await axios.get(
            `http://localhost:8000/api/chat/servermessages/${selectedChannel._id}`,
            { withCredentials: true }
          );
        } else {
          response = await axios.get(
            `http://localhost:8000/api/chat/directmessages/${selectedChannel._id}`,
            { withCredentials: true }
          );
        }
        setMessages(response.data);
        setFetched(true);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedChannel, user._id]);

  useEffect(() => {
    if (selectedChannel?._id && user?._id) {
      if (selectedChannel.type === 'group') {
        socket.emit("joinGroup", selectedChannel._id);
      } else if (selectedChannel.type === 'server') {
        console.log("Joining server channel", selectedChannel._id);
        socket.emit("joinServerChannel", selectedChannel._id);
      } else {
        socket.emit("joinDM", { userId: user._id, otherUserId: selectedChannel._id });
      }
    }
  }, [selectedChannel, user._id]);

  useEffect(() => {
    if (!fetched) return;

    const handleNewMessage = (msg) => {
      if (selectedChannel?.type === 'server') {
        console.log("Received server message", msg);
      }
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };
    
    if (selectedChannel?.type === 'group') {
      socket.on("receiveGroupMessage", handleNewMessage);
      return () => socket.off("receiveGroupMessage", handleNewMessage);
    } else if (selectedChannel?.type === 'server') {
      socket.on("receiveServerMessage", handleNewMessage);
      return () => socket.off("receiveServerMessage", handleNewMessage);
    } else {
      socket.on("receiveDirectMessage", handleNewMessage);
      return () => socket.off("receiveDirectMessage", handleNewMessage);
    }
  }, [fetched, selectedChannel]);

  useEffect(() => {
    const handleDeleteForEveryone = (updatedMessage) => {
      console.log("Received delete for everyone", updatedMessage);
      setMessages(prevMsgs => prevMsgs.map(msg =>
        msg._id === updatedMessage._id ? updatedMessage : msg
      ));
    };
    
    socket.on("messageDeletedForEveryone", handleDeleteForEveryone);
    return () => socket.off("messageDeletedForEveryone", handleDeleteForEveryone);
  }, [selectedChannel]);

  useEffect(() => {
    // Check if user is suspended
    if (user) {
      setIsSuspended(user.isSuspended);
    }
  }, [user]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      sendMessage(file);
    }
  };

  const sendMessage = async (file = null) => {
    if (isSuspended) {
      setShowSuspendedMessage(true);
      setTimeout(() => setShowSuspendedMessage(false), 5000);
      return;
    }

    if (!selectedChannel || !selectedChannel._id) {
      alert('No recipient selected!');
      return;
    }
    if (!inputValue.trim() && !file) return;
    setUploadError("");
    // Only show spinner if uploading a file
    setUploadingFile(!!file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('text', inputValue);
      if (file) {
        formData.append('file', file);
      }
      if (selectedChannel.type === 'group') {
        formData.append('groupId', selectedChannel._id);
        await axios.post(
          "http://localhost:8000/api/chat/group/send",
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else if (selectedChannel.type === 'server') {
        formData.append('channelId', selectedChannel._id);
        await axios.post(
          "http://localhost:8000/api/chat/server/send",
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        formData.append('receiverId', selectedChannel._id);
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
      }
      setInputValue("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      let msg = "Failed to send message.";
      if (error.response && error.response.data && error.response.data.error) {
        msg = error.response.data.error;
      } else if (error.message) {
        msg = error.message;
      }
      setUploadError(msg);
    } finally {
      setUploading(false);
      setUploadingFile(false);
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
        if (selectedChannel.type === 'group' || selectedChannel.type === 'server') {
          await axios.delete(
            `http://localhost:8000/api/chat/message/${messageId}/foreveryone`,
            { withCredentials: true }
          );
        } else {
          socket.emit("deleteDirectMessageForEveryone", {
            messageId,
            senderId: user._id,
            receiverId: selectedChannel._id,
          });
        }
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

  useEffect(() => {
    // Only scroll if a new message was added
    if (messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Initialize peer connection
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };
    const pc = new RTCPeerConnection(configuration);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('iceCandidate', {
          to: selectedChannel._id,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    return pc;
  };

  // Handle incoming call
  useEffect(() => {
    const handleIncomingCall = async ({ from, offer, type }) => {
      setCaller(from);
      setCallOffer(offer);
      setCallType(type);
      setIsIncomingCall(true);
    };
    const handleCallAnswered = async ({ answer }) => {
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error setting remote description:', error);
      }
    };
    const handleIceCandidate = async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    };
    const handleCallEnded = () => {
      endCall(false); // Don't emit again!
    };
    socket.on('incomingCall', handleIncomingCall);
    socket.on('callAnswered', handleCallAnswered);
    socket.on('iceCandidate', handleIceCandidate);
    socket.on('callEnded', handleCallEnded);
    return () => {
      socket.off('incomingCall', handleIncomingCall);
      socket.off('callAnswered', handleCallAnswered);
      socket.off('iceCandidate', handleIceCandidate);
      socket.off('callEnded', handleCallEnded);
    };
  }, [selectedChannel]);

  // End call, with emit control
  const endCall = (emit = true) => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setIsIncomingCall(false);
    setCallType(null);
    setCaller(null);
    setCallOffer(null);
    // Only emit if this user is ending the call
    if (emit && selectedChannel) {
      socket.emit('endCall', { to: selectedChannel._id });
    }
  };

  // Start call
  const startCall = async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      });
      setLocalStream(stream);
      setCallType(type);
      setIsCallActive(true);

      peerConnection.current = initializePeerConnection();
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit('callUser', {
        from: user._id,
        to: selectedChannel._id,
        offer,
        type
      });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  // Answer call
  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });
      setLocalStream(stream);
      setIsCallActive(true);
      setIsIncomingCall(false);

      peerConnection.current = initializePeerConnection();
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(callOffer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit('answerCall', {
        from: user._id,
        to: caller,
        answer
      });
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  // Attach local stream to local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Attach remote stream to audio element for voice calls
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    const handleConnect = () => {
      setSocketConnected(true);
      if (user && user._id) {
        socket.emit("registerUser", user._id);
      }
    };
    const handleDisconnect = () => setSocketConnected(false);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    // Initial registration if already connected
    if (socket.connected && user && user._id) {
      socket.emit("registerUser", user._id);
      setSocketConnected(true);
    }
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [user]);

  // Toggle mute
  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      });
    }
  };

  // Toggle camera
  const handleToggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsCameraOff(!track.enabled);
      });
    }
  };

  // Reset mute/camera state on call start/end
  useEffect(() => {
    setIsMuted(false);
    setIsCameraOff(false);
  }, [isCallActive, isIncomingCall]);

  if (isVoiceChannel) {
    return <VoiceChannelCard channel={selectedChannel} currentUser={user} usersInChannel={usersInChannel} />;
  }

  // Add call controls to the header (glassmorphic, modern style)
  const renderCallControls = () => {
    if (!selectedChannel || selectedChannel.type !== 'direct') return null;

    return (
      <div className="flex space-x-5 items-center ml-8">
        <Tooltip title={socketConnected ? "Voice Call" : "Connecting..."} placement="bottom">
          <button
            onClick={() => startCall('voice')}
            className="transition-all duration-200 rounded-full p-2.5 bg-white/20 backdrop-blur-md shadow-lg border-2 border-green-400 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 hover:scale-110 active:scale-95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start Voice Call"
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={!socketConnected}
          >
            <FaPhone className="text-green-500 text-xl drop-shadow" />
          </button>
        </Tooltip>
        <Tooltip title={socketConnected ? "Video Call" : "Connecting..."} placement="bottom">
          <button
            onClick={() => startCall('video')}
            className="transition-all duration-200 rounded-full p-2.5 bg-white/20 backdrop-blur-md shadow-lg border-2 border-blue-400 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:scale-110 active:scale-95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start Video Call"
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={!socketConnected}
          >
            <FaVideo className="text-blue-500 text-xl drop-shadow" />
          </button>
        </Tooltip>
      </div>
    );
  };

  // Add call UI (modern, beautiful, advanced)
  const renderCallUI = () => {
    if (!isCallActive && !isIncomingCall) return null;

    // Incoming call modal
    if (isIncomingCall) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-xs w-full border border-gray-700">
            <div className="mb-4">
              <div className="flex items-center justify-center mb-2">
                <div className={`rounded-full bg-gradient-to-tr ${callType === 'video' ? 'from-blue-500 to-blue-700' : 'from-green-500 to-green-700'} p-4 shadow-lg`}>
                  {callType === 'video' ? <FaVideo className="text-3xl text-white" /> : <FaPhone className="text-3xl text-white" />}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white text-center">Incoming {callType === 'video' ? 'Video' : 'Voice'} Call</h3>
              <p className="text-gray-300 text-center mt-1">from <span className="font-bold">{selectedChannel?.name || 'Unknown'}</span></p>
            </div>
            <div className="flex space-x-6 mt-6">
              <button
                onClick={answerCall}
                className="rounded-full bg-green-500 hover:bg-green-600 text-white p-4 shadow-lg text-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Answer Call"
              >
                <FaPhone />
              </button>
              <button
                onClick={endCall}
                className="rounded-full bg-red-500 hover:bg-red-600 text-white p-4 shadow-lg text-2xl focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Decline Call"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Ongoing call modal
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#232b4a] to-[#6c63ff] font-sans" style={{ fontFamily: 'Inter, Nunito, system-ui, sans-serif' }}>
        {/* Main call area */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Remote video/avatar */}
          <div className="flex flex-col items-center justify-center w-full">
            {callType === 'video' ? (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-2 border-2 border-[#7f7fff]" style={{maxWidth: 700, marginTop: 32}}>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="mx-auto rounded-2xl shadow-lg border-2 border-[#7f7fff] bg-black transition-all duration-300"
                    style={{
                      width: 'min(90vw, 640px)',
                      height: 'min(50vw, 360px)',
                      aspectRatio: '16/9',
                      objectFit: 'contain',
                      background: '#181f3a',
                    }}
                  />
                </div>
                <span className="mt-4 text-[#e0e6ff] text-lg font-semibold drop-shadow-lg tracking-wide" style={{letterSpacing: '0.02em'}}>{selectedChannel?.name || 'Remote User'}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="rounded-full bg-gradient-to-tr from-[#7f7fff] to-[#43e97b] p-12 shadow-2xl mb-4">
                  <FaUserCircle className="text-8xl text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2 drop-shadow-lg tracking-wide">Voice Call with {selectedChannel?.name || 'Remote User'}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-300 text-base">In Call</span>
                </div>
                <audio ref={remoteAudioRef} autoPlay />
              </div>
            )}
          </div>

          {/* Local video/avatar (floating) */}
          <div
            className="absolute right-6 bottom-28 md:right-12 md:bottom-20 flex flex-col items-center"
            style={{ zIndex: 20 }}
          >
            {callType === 'video' ? (
              <div className="rounded-2xl shadow-lg border-2 border-[#43e97b] bg-[#232b4a]/80 transition-all duration-300 ring-2 ring-[#43e97b]">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="rounded-2xl object-contain"
                  style={{
                    width: '110px',
                    height: '62px',
                    aspectRatio: '16/9',
                    display: isCameraOff ? 'none' : 'block',
                    background: '#232b4a',
                  }}
                />
                {isCameraOff && (
                  <div className="w-[110px] h-[62px] flex items-center justify-center text-gray-500 bg-[#232b4a] rounded-2xl">
                    <FaVideoSlash className="text-2xl" />
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-full bg-gradient-to-tr from-[#43e97b] to-[#7f7fff] p-2 shadow-lg">
                <FaUserCircle className="text-3xl text-white" />
              </div>
            )}
            <span className="text-[#e0e6ff] text-xs mt-1 font-medium">You</span>
          </div>

          {/* Controls Bar */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-8 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 shadow-2xl border border-[#7f7fff]" style={{ zIndex: 30 }}>
            {/* Mute/Unmute */}
            <button
              onClick={handleToggleMute}
              className={`focus:outline-none rounded-full p-4 text-2xl transition-colors duration-150 ${isMuted ? 'bg-[#ff4f5a] text-white' : 'bg-[#232b4a] text-[#43e97b] hover:bg-[#2d375a]'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            {/* Camera On/Off (only for video call) */}
            {callType === 'video' && (
              <button
                onClick={handleToggleCamera}
                className={`focus:outline-none rounded-full p-4 text-2xl transition-colors duration-150 ${isCameraOff ? 'bg-[#ffb84f] text-white' : 'bg-[#232b4a] text-[#7f7fff] hover:bg-[#2d375a]'}`}
                title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
              </button>
            )}
            {/* End Call */}
            <button
              onClick={() => endCall()}
              className="focus:outline-none rounded-full w-20 h-20 flex items-center justify-center bg-gradient-to-tr from-[#ff4f5a] to-[#ff6f91] text-white shadow-xl border-4 border-[#ff4f5a] hover:from-[#ff6f91] hover:to-[#ff4f5a] text-3xl transition-all duration-150"
              aria-label="End Call"
              title="End Call"
              style={{ marginLeft: 16, marginRight: 8 }}
            >
              <FaPhone />
            </button>
          </div>
        </div>
      </div>
    );
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
              {renderCallControls()}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChannel ? (
          <>
            {/* Suspended user message */}
            {showSuspendedMessage && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
                <AlertCircle size={20} />
                <span>You are suspended from sending any message. Please contact the administration at nu-cord@gmail.com to resolve the matter</span>
              </div>
            )}
            {/* Error message */}
            {uploadError && (
              <div className="mb-2 text-red-400 bg-red-900 bg-opacity-30 px-3 py-2 rounded">
                {uploadError}
              </div>
            )}
            {/* Loading indicator */}
            {uploadingFile && uploading && (
              <div className="mb-2 flex items-center gap-2">
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500"></span>
                </span>
                <span className="text-blue-300 font-medium">Uploading file...</span>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex flex-col ${
                  (msg.sender && msg.sender._id === user._id) ? "items-end" : "items-start"
                }`}
              >
                <span className="text-sm text-gray-400 mb-1">
                  {(selectedChannel.type === 'group' || selectedChannel.type === 'server')
                    ? (msg.sender && msg.sender._id === user._id ? 'You' : msg.sender?.name)
                    : (msg.sender && msg.sender._id === user._id ? 'You' : selectedChannel.name)}
                </span>

                <div className="relative group">
                  {(() => {
                    if (msg.deleteFromEveryone) {
                      return (
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          (msg.sender && msg.sender._id === user._id) ? "bg-[#3a2257]" : "bg-gray-700"
                        } text-white`}>
                          <span className="italic text-gray-400">This message was deleted</span>
                        </div>
                      );
                    }
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
            <p>Select a server/channel to start chatting</p>
          </div>
        )}
      </div>

      {selectedChannel && (
        <div className="border-t border-gray-700">
          {isAnnouncementChannel && !isAdmin ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-800 shadow-lg border border-yellow-400">
                <FaLock className="text-2xl text-yellow-200" />
                <span className="text-lg font-semibold text-yellow-90">This is a read-only channel. Only admins can send messages in here.</span>
              </div>
            </div>
          ) : isSuspended ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-800 shadow-lg border border-red-400">
                <AlertCircle className="text-2xl text-red-200" />
                <span className="text-lg font-semibold text-red-90">Your account is suspended. Please contact the administration at nu-cord@gmail.com to resolve the matter.</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
                disabled={!canSendMessages}
              />
              <FaPaperclip 
                className={`text-xl cursor-pointer hover:text-gray-400 ${!canSendMessages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => canSendMessages && fileInputRef.current.click()}
              />
              <input
                type="text"
                placeholder={`Message #${selectedChannel.name}`}
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!canSendMessages}
              />
              <div className="relative" ref={emojiPickerRef}>
                <FaSmile 
                  className={`text-xl cursor-pointer hover:text-gray-400 ${!canSendMessages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => canSendMessages && setShowEmojiPicker(!showEmojiPicker)}
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
                className={`text-xl cursor-pointer hover:text-gray-400 ${isRecording ? 'text-red-500 animate-pulse' : ''} ${!canSendMessages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => canSendMessages && handleMicClick()}
                title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
              />
            </div>
          )}
        </div>
      )}
      
      {renderCallUI()}
    </div>
  );
};

export default Chat;
