import React, { useState } from "react";
import { FaVolumeUp, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaUserCircle } from "react-icons/fa";

const VoiceChannelCard = ({ channel, currentUser, usersInChannel }) => {
  const [joined, setJoined] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  const handleJoinLeave = () => setJoined((j) => !j);
  const handleMicToggle = () => setMicMuted((m) => !m);
  const handleCamToggle = () => setCamOff((c) => !c);

  return (
    <div className="max-w-xl mx-auto mt-12 bg-[#f6e7b4] rounded-2xl shadow-2xl border-2 border-yellow-300 p-8 flex flex-col items-center">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-200 mb-2">
          <FaVolumeUp className="text-4xl text-yellow-600" />
        </div>
        <span className="font-bold text-2xl text-gray-800 mb-1">{channel.name}</span>
        <span className="text-gray-500 text-sm">Voice Channel</span>
      </div>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 ${joined ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}`}
          onClick={handleJoinLeave}
        >
          {joined ? "Leave" : "Join"}
        </button>
        <button
          className={`rounded-full p-3 text-xl ${micMuted ? "bg-red-200 text-red-600" : "bg-gray-900 text-white"}`}
          onClick={handleMicToggle}
          disabled={!joined}
          title={micMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {micMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button
          className={`rounded-full p-3 text-xl ${camOff ? "bg-red-200 text-red-600" : "bg-gray-900 text-white"}`}
          onClick={handleCamToggle}
          disabled={!joined}
          title={camOff ? "Turn Camera On" : "Turn Camera Off"}
        >
          {camOff ? <FaVideoSlash /> : <FaVideo />}
        </button>
      </div>
      <div className="w-full mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Users in Channel</h3>
        <div className="flex flex-col gap-3">
          {usersInChannel && usersInChannel.length > 0 ? (
            usersInChannel.map((user) => (
              <div key={user._id} className="flex items-center gap-3 bg-yellow-100 rounded-lg px-4 py-2">
                {user.pfp ? (
                  <img src={user.pfp} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400" />
                ) : (
                  <FaUserCircle className="text-2xl text-gray-400" />
                )}
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No users in this channel yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChannelCard; 