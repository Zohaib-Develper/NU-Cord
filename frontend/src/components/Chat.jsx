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
  FaPhone,
  FaVideo,
  FaTrash,
  FaTimes,
  FaVolumeUp,
  FaVolumeMute,
  FaVideoSlash,
} from "react-icons/fa";
import { AuthContext } from "../utils/AuthContext";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:8000");

const Chat = ({ selectedChannel }) => {
  // Chat state
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

  // Call state
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callEndedBy, setCallEndedBy] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Refs
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();

  // Helper function to determine if call buttons should be shown
  const shouldShowCallButtons = () => {
    if (!selectedChannel) return false;

    // Show for direct messages (users)
    if (
      "pfp" in selectedChannel &&
      "batch" in selectedChannel &&
      "name" in selectedChannel &&
      "campus" in selectedChannel
    )
      return true;

    // Show for groups
    if (
      "joining_restriction" in selectedChannel &&
      "inviteURL" in selectedChannel &&
      "joining_requests" in selectedChannel
    )
      return true;

    // For voice channels only in servers
    if (
      "name" in selectedChannel &&
      "owner_server" in selectedChannel &&
      "type" in selectedChannel &&
      selectedChannel.type === "voice"
    )
      return true;

    return false;
  };

  // Chat functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      sendMessage(file);
    }
  };

  const sendMessage = async (file = null) => {
    if (!selectedChannel || !selectedChannel._id) {
      alert("No recipient selected!");
      return;
    }
    if (!inputValue.trim() && !file) return;
    try {
      const formData = new FormData();
      formData.append("text", inputValue);
      formData.append("receiverId", selectedChannel._id);
      if (file) {
        formData.append("file", file);
      }
      await axios.post("http://localhost:8000/api/chat/send", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
      setShowDeleteMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInputValue((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return <FaImage className="text-blue-500" />;
    }
    return <FaFile className="text-gray-400" />;
  };

  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorder) mediaRecorder.stop();
      setIsRecording(false);
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          let mimeType = "audio/ogg;codecs=opus";
          if (!window.MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "audio/webm;codecs=opus";
          }
          if (!window.MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "audio/webm";
          }
          if (!window.MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "";
          }
          const recorder = new window.MediaRecorder(
            stream,
            mimeType ? { mimeType } : undefined
          );
          let localChunks = [];
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) localChunks.push(e.data);
          };
          recorder.onstop = () => {
            setTimeout(() => {
              if (localChunks.length > 0) {
                const audioBlob = new Blob(localChunks, {
                  type: mimeType || "audio/webm",
                });
                const audioFile = new File(
                  [audioBlob],
                  `voice-note-${Date.now()}.${
                    mimeType.includes("ogg") ? "ogg" : "webm"
                  }`,
                  { type: mimeType || "audio/webm" }
                );
                sendMessage(audioFile);
              }
              localChunks = [];
            }, 0);
          };
          recorder.start();
          setMediaRecorder(recorder);
          setIsRecording(true);
        } catch (err) {
          alert("Microphone access denied or not available.");
        }
      } else {
        alert("Audio recording not supported in this browser.");
      }
    }
  };

  // Call functions
  const startCall = async (type) => {
    try {
      console.log("Starting call...");

      const isSameMachine =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video:
          type === "video"
            ? {
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                frameRate: { ideal: 30, max: 60 },
                facingMode: "user",
              }
            : false,
      };

      const stream = await navigator.mediaDevices
        .getUserMedia(constraints)
        .catch((err) => {
          console.error("Error getting media:", err);
          if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            alert("Required device not found");
          } else if (
            err.name === "NotReadableError" ||
            err.name === "TrackStartError"
          ) {
            alert("Device is already in use");
          } else if (
            err.name === "OverconstrainedError" ||
            err.name === "ConstraintNotSatisfiedError"
          ) {
            alert("Constraints could not be satisfied");
          } else if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            alert("Permissions denied - please allow camera/microphone access");
          } else if (err.name === "TypeError") {
            alert("Empty constraints object");
          } else {
            alert(`Error: ${err.message}`);
          }
          throw err;
        });

      console.log("Got local stream:", stream);

      setLocalStream(stream);
      setCallType(type);
      setCallActive(true);
      setCallEndedBy(null);
      setIsMuted(false);
      setIsVideoOff(false);

      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
        iceTransportPolicy: isSameMachine ? "all" : "relay",
      });
      setPeerConnection(peer);

      stream.getTracks().forEach((track) => {
        console.log("Adding track:", track.kind);
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        console.log("Received remote track:", event.track.kind);
        if (!event.streams || event.streams.length === 0) return;

        const remoteStream = event.streams[0];
        setRemoteStream(remoteStream);

        if (type === "video") {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current
              .play()
              .catch((e) => console.error("Video play error:", e));
          }
        } else {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current
              .play()
              .catch((e) => console.error("Audio play error:", e));
          }
        }
      };

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          console.log("Sending ICE candidate");
          socket.emit("iceCandidate", {
            to: selectedChannel._id,
            candidate: e.candidate,
          });
        }
      };

      peer.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peer.iceConnectionState);
        if (
          peer.iceConnectionState === "disconnected" ||
          peer.iceConnectionState === "failed"
        ) {
          console.log("ICE connection failed, ending call");
          endCall();
        }
      };

      peer.onconnectionstatechange = () => {
        console.log("Connection state:", peer.connectionState);
        if (
          peer.connectionState === "disconnected" ||
          peer.connectionState === "failed"
        ) {
          console.log("Connection failed, ending call");
          endCall();
        }
      };

      const offer = await peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: type === "video",
      });
      console.log("Created offer:", offer);

      await peer.setLocalDescription(offer);
      console.log("Set local description");

      socket.emit("callUser", {
        from: user._id,
        to: selectedChannel._id,
        offer,
        type,
      });

      if (type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current
          .play()
          .catch((e) => console.error("Local video play error:", e));
      } else if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
        localAudioRef.current
          .play()
          .catch((e) => console.error("Local audio play error:", e));
      }
    } catch (error) {
      console.error("Error starting call:", error);
      alert(`Could not start call: ${error.message}`);
      endCall();
    }
  };

  const answerCall = async () => {
    try {
      console.log("Answering call...");

      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video:
          incomingCall.type === "video"
            ? {
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                frameRate: { ideal: 30, max: 60 },
                facingMode: "user",
              }
            : false,
      };

      const stream = await navigator.mediaDevices
        .getUserMedia(constraints)
        .catch((err) => {
          console.error("Error getting media:", err);
          if (err.name === "NotAllowedError") {
            alert("Please allow camera and microphone access");
          } else {
            alert(`Could not access media devices: ${err.message}`);
          }
          throw err;
        });

      console.log("Got local stream:", stream);

      setLocalStream(stream);
      setCallType(incomingCall.type);
      setCallActive(true);
      setCallEndedBy(null);
      setIsMuted(false);
      setIsVideoOff(false);

      const isSameMachine =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
        iceTransportPolicy: isSameMachine ? "all" : "relay",
      });
      setPeerConnection(peer);

      stream.getTracks().forEach((track) => {
        console.log("Adding track:", track.kind);
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        console.log("Received remote track:", event.track.kind);
        if (!event.streams || event.streams.length === 0) return;

        const remoteStream = event.streams[0];
        setRemoteStream(remoteStream);

        if (incomingCall.type === "video") {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current
              .play()
              .catch((e) => console.error("Remote video play error:", e));
          }
        } else {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current
              .play()
              .catch((e) => console.error("Remote audio play error:", e));
          }
        }
      };

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          console.log("Sending ICE candidate");
          socket.emit("iceCandidate", {
            to: incomingCall.from,
            candidate: e.candidate,
          });
        }
      };

      peer.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peer.iceConnectionState);
      };

      await peer.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );
      console.log("Set remote description");

      const answer = await peer.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: incomingCall.type === "video",
      });
      console.log("Created answer:", answer);

      await peer.setLocalDescription(answer);
      console.log("Set local description");

      socket.emit("answerCall", {
        from: user._id,
        to: incomingCall.from,
        answer,
      });

      if (incomingCall.type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current
          .play()
          .catch((e) => console.error("Local video play error:", e));
      } else if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
        localAudioRef.current
          .play()
          .catch((e) => console.error("Local audio play error:", e));
      }

      setIncomingCall(null);
    } catch (error) {
      console.error("Error answering call:", error);
      alert(`Could not answer call: ${error.message}`);
      endCall();
    }
  };

  const endCall = (initiatedBy = user._id) => {
    if (!callActive && !peerConnection) return;

    console.log(`Ending call initiated by ${initiatedBy}`);
    setCallEndedBy(initiatedBy);
    setCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);

    if (peerConnection) {
      peerConnection.onicecandidate = null;
      peerConnection.ontrack = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.onconnectionstatechange = null;

      peerConnection.close();
      console.log("Closed peer connection");
      setPeerConnection(null);
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped local track:", track.kind);
      });
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped remote track:", track.kind);
      });
      setRemoteStream(null);
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localAudioRef.current) localAudioRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

    if (initiatedBy === user._id && selectedChannel?._id) {
      socket.emit("endCall", {
        to: selectedChannel._id,
        from: user._id,
      });
    }

    console.log("Call ended");
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream && callType === "video") {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // Effects (keep all your existing useEffect hooks)
  // Effects
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
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveDirectMessage", handleNewMessage);
    return () => socket.off("receiveDirectMessage", handleNewMessage);
  }, [fetched]);

  useEffect(() => {
    const handleDeleteForEveryone = (updatedMessage) => {
      setMessages((prevMsgs) =>
        prevMsgs.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    };

    socket.on("messageDeletedForEveryone", handleDeleteForEveryone);
    return () =>
      socket.off("messageDeletedForEveryone", handleDeleteForEveryone);
  }, []);

  useEffect(() => {
    if (selectedChannel?._id && user?._id) {
      socket.emit("joinDM", {
        userId: user._id,
        otherUserId: selectedChannel._id,
      });
    }
  }, [selectedChannel, user._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        console.log("Available devices:", devices);
      })
      .catch((err) => {
        console.error("Error enumerating devices:", err);
      });

    socket.emit("registerUser", user._id);
    console.log("Registered user:", user._id);

    socket.on("incomingCall", (data) => {
      if (data.to !== user._id) return;
      console.log("Incoming call received:", data);
      setIncomingCall(data);
    });

    socket.on("callAnswered", async ({ answer }) => {
      console.log("Call answered:", answer);
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log("Set remote description from answer");
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      }
    });

    socket.on("iceCandidate", ({ candidate }) => {
      console.log("Received ICE candidate:", candidate);
      if (peerConnection && candidate) {
        try {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("Added ICE candidate");
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    socket.on("callEnded", ({ from }) => {
      console.log("Remote peer ended call from:", from);
      if (from !== user._id) {
        endCall(from);
      }
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAnswered");
      socket.off("iceCandidate");
      socket.off("callEnded");
    };
  }, [socket, peerConnection]);

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      endCall(user._id);
    };
  }, [mediaRecorder]);

  // Render full-screen call interface if call is active
  if (callActive) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
        {/* Call header */}
        <div className="p-4 bg-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={
                selectedChannel.pfp ||
                `https://ui-avatars.com/api/?name=${selectedChannel.name}&background=random`
              }
              alt={selectedChannel.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{selectedChannel.name}</h3>
              <p className="text-sm text-gray-400">
                {callType === "video" ? "Video call" : "Voice call"}
              </p>
            </div>
          </div>
          <button
            onClick={() => endCall(user._id)}
            className="text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Video call container */}
        {callType === "video" ? (
          <div className="flex-1 relative bg-black">
            {/* Remote video (full screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Local video (small picture-in-picture) */}
            <div className="absolute bottom-20 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden shadow-xl border-2 border-gray-600">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <FaVideoSlash className="text-white text-2xl" />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Voice call interface */
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-900">
            <div className="relative mb-6">
              <img
                src={
                  selectedChannel.pfp ||
                  `https://ui-avatars.com/api/?name=${selectedChannel.name}&background=random`
                }
                alt={selectedChannel.name}
                className="w-40 h-40 rounded-full border-4 border-blue-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-3">
                <FaPhone className="text-white text-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold">{selectedChannel.name}</h3>
            <p className="text-gray-400 mt-2">Call in progress</p>

            {/* Audio elements (hidden) */}
            <audio
              ref={remoteAudioRef}
              autoPlay
              playsInline
              className="hidden"
            />
            <audio
              ref={localAudioRef}
              autoPlay
              muted
              playsInline
              className="hidden"
            />

            {/* Voice call animation */}
            <div className="mt-8 flex space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-3 h-12 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Call controls */}
        <div className="p-6 bg-gray-800 flex justify-center space-x-8">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? "bg-red-600" : "bg-gray-700"
            } hover:bg-gray-600`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <FaVolumeMute className="text-xl text-white" />
            ) : (
              <FaVolumeUp className="text-xl text-white" />
            )}
          </button>

          {callType === "video" && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoOff ? "bg-red-600" : "bg-gray-700"
              } hover:bg-gray-600`}
              title={isVideoOff ? "Turn on video" : "Turn off video"}
            >
              {isVideoOff ? (
                <FaVideoSlash className="text-xl text-white" />
              ) : (
                <FaVideo className="text-xl text-white" />
              )}
            </button>
          )}

          <button
            onClick={() => endCall(user._id)}
            className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700"
            title="End call"
          >
            <FaPhone className="text-xl transform rotate-135" />
          </button>
        </div>
      </div>
    );
  }

  // Render incoming call screen if there's an incoming call
  if (incomingCall && !callActive) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center w-full max-w-md mx-4">
          <div className="mb-6 flex flex-col items-center">
            <img
              src={
                selectedChannel.pfp ||
                `https://ui-avatars.com/api/?name=${selectedChannel.name}&background=random`
              }
              alt={selectedChannel.name}
              className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500"
            />
            <h2 className="text-3xl font-bold text-white">
              {selectedChannel.name}
            </h2>
            <p className="text-gray-300 mt-2 text-xl">
              {incomingCall.type === "video"
                ? "Incoming Video Call"
                : "Incoming Voice Call"}
            </p>
          </div>

          <div className="flex justify-center space-x-8">
            <button
              onClick={() => {
                setIncomingCall(null);
                socket.emit("endCall", {
                  to: incomingCall.from,
                  from: user._id,
                });
              }}
              className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700"
              title="Decline"
            >
              <FaTimes className="text-2xl" />
            </button>
            <button
              onClick={answerCall}
              className="bg-green-600 text-white p-4 rounded-full hover:bg-green-700"
              title="Accept"
            >
              <FaPhone className="text-2xl" />
            </button>
          </div>

          {incomingCall.type === "video" && (
            <div className="mt-6 text-gray-400 text-sm">
              <p>Your camera will be turned on when you answer</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal chat interface when no call is active
  return (
    <div className="h-full max-w-280 bg-gray-900 text-white flex flex-col">
      {/* Header with call buttons */}
      {selectedChannel && (
        <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-bold">
            {selectedChannel ? `# ${selectedChannel.name}` : "Select a channel"}
          </h2>
          {shouldShowCallButtons() && (
            <div className="flex space-x-4">
              <button
                onClick={() => startCall("voice")}
                className="p-2 rounded-full bg-green-600 hover:bg-green-700"
                title="Voice Call"
              >
                <FaPhone />
              </button>
              <button
                onClick={() => startCall("video")}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"
                title="Video Call"
              >
                <FaVideo />
              </button>
            </div>
          )}
          <div className="flex space-x-5">
            {selectedChannel && (
              <>
                <FaThumbtack className="text-xl cursor-pointer hover:text-gray-400" />
                <FaQuestionCircle className="text-xl cursor-pointer hover:text-gray-400" />
              </>
            )}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChannel ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex flex-col ${
                  msg.sender && msg.sender._id === user._id
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-xs md:max-w-md lg:max-w-lg ${
                    msg.sender && msg.sender._id === user._id
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={
                        msg.sender?.avatar ||
                        `https://ui-avatars.com/api/?name=${msg.sender?.name}&background=random`
                      }
                      alt={msg.sender?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={`flex items-center gap-1 ${
                        msg.sender && msg.sender._id === user._id
                          ? "justify-end"
                          : ""
                      }`}
                    >
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        msg.sender && msg.sender._id === user._id
                          ? "bg-blue-600"
                          : "bg-gray-700"
                      }`}
                    >
                      {!msg.deleteFromMe &&
                        !msg.deleteFromEveryone &&
                        msg.text && (
                          <p className="text-white break-words">{msg.text}</p>
                        )}

                      {!msg.deleteFromMe && msg.deleteFromEveryone && (
                        <p className="text-gray-400 italic">
                          This message was deleted
                        </p>
                      )}

                      {msg.file && (
                        <div className="mt-2 flex items-center gap-2">
                          {getFileIcon(msg.file)}
                          <a
                            href={`http://localhost:8000/${msg.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:underline"
                          >
                            {msg.file.split("/").pop()}
                          </a>
                        </div>
                      )}
                    </div>
                    {msg.sender && msg.sender._id === user._id && (
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setShowDeleteMenu(
                              showDeleteMenu === msg._id ? null : msg._id
                            )
                          }
                          className="text-gray-400 hover:text-gray-200 p-1"
                        >
                          <FaEllipsisV size={14} />
                        </button>
                        {showDeleteMenu === msg._id && (
                          <div
                            ref={menuRef}
                            className="absolute top-6 right-0 bg-gray-800 rounded shadow-lg z-10"
                          >
                            <button
                              onClick={() =>
                                handleDeleteMessage(msg._id, "forme")
                              }
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 w-full"
                            >
                              <FaTrash size={12} />
                              Delete for me
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteMessage(msg._id, "everyone")
                              }
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 w-full"
                            >
                              <FaTrash size={12} />
                              Delete for everyone
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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

      {/* Message input */}
      {selectedChannel && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,audio/*"
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
              className={`text-xl cursor-pointer hover:text-gray-400 ${
                isRecording ? "text-red-500 animate-pulse" : ""
              }`}
              onClick={handleMicClick}
              title={isRecording ? "Stop Recording" : "Record Voice Note"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
