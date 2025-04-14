import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Settings = ({ onClose }) => {
  const [username, setUsername] = useState("maamooon");
  const [name, setName] = useState("Mamoon Ahmad");
  const [email] = useState("l226880@lhr.nu.edu.pk");
  const [campus] = useState("Lahore");
  const [batch] = useState("2022");
  const [program] = useState("BS(CS)");
  const [socials, setSocials] = useState([]);
  const [selectedSocial, setSelectedSocial] = useState("GitHub");
  const [socialLink, setSocialLink] = useState("");

  const socialOptions = ["GitHub", "LinkedIn", "Instagram"];

  const handleAddSocial = () => {
    if (socialLink.trim() !== "") {
      setSocials([...socials, { platform: selectedSocial, link: socialLink }]);
      setSocialLink("");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg flex justify-center items-center"
      onClick={onClose}>
      <div
        className="bg-gray-900 text-white p-6 rounded-lg w-auto shadow-lg relative h-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
          Settings
        </h2>

        <div className="flex flex-col gap-4 flex-grow">
          {/* Username (Editable) */}
          <div>
            <label className="text-gray-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded mt-1"
            />
          </div>

          {/* Name (Editable) */}
          <div>
            <label className="text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded mt-1"
            />
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>

          {/* Campus (Read-Only) */}
          <div>
            <label className="text-gray-400">Campus</label>
            <input
              type="text"
              value={campus}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>

          {/* Batch (Read-Only) */}
          <div>
            <label className="text-gray-400">Batch</label>
            <input
              type="text"
              value={batch}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-gray-400">Programme</label>
            <input
              type="text"
              value={program}
              readOnly
              className="w-full bg-gray-800 text-gray-400 p-2 rounded mt-1 cursor-not-allowed"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="text-gray-400">Social Links</label>
            <div className="flex gap-2 mt-1">
              <select
                value={selectedSocial}
                onChange={(e) => setSelectedSocial(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded">
                {socialOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                placeholder="Enter link"
                className="flex-grow bg-gray-800 text-white p-2 rounded"
              />
              <button
                onClick={handleAddSocial}
                className="bg-blue-500 p-2 rounded text-white">
                <FaPlus />
              </button>
            </div>
            <ul className="mt-2">
              {socials.map((social, index) => (
                <li
                  key={index}
                  className="text-gray-300 flex justify-between items-center">
                  <span>
                    {social.platform}: {social.link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
