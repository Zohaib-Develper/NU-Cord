import React, { useState } from "react";
import ProfileImage from "../assets/profile.jpeg";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Profile = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg flex justify-center items-center"
      onClick={onClose}>
      <div
        className="bg-gray-900 text-white p-6 rounded-lg w-200 shadow-lg relative h-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <img
            src={ProfileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">Mamoon Ahmad</h2>
            <p className="text-gray-400">maamooon</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-around mt-2 border-b border-gray-700 pb-2">
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "info" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("info")}>
            User Info
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "friends"
                ? "border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("friends")}>
            Friends
          </button>
          <button
            className={`hover:text-white cursor-pointer ${
              activeTab === "servers"
                ? "border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("servers")}>
            Servers
          </button>
        </div>

        {/* Content Sections */}
        <div className="mt-4 flex-grow pb-3">
          {activeTab === "info" && (
            <div>
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-gray-300 text-sm mt-2">
                Passionate about coding, problem-solving, and building scalable
                applications. Always learning and exploring new technologies.
              </p>
              <h3 className="text-lg font-semibold mt-2">Batch</h3>
              <p className="text-gray-300 text-sm ">2022</p>
              <h3 className="text-lg font-semibold">Program</h3>
              <p className="text-gray-300 text-sm">BS(CS)</p>
              <h3 className="text-lg font-semibold">Campus</h3>
              <p className="text-gray-300 text-sm">Lahore</p>
            </div>
          )}

          {activeTab === "friends" && (
            <div>
              <h3 className="text-lg font-semibold">Friends</h3>
              <ul className="mt-2">
                <li className="text-gray-300">John Doe</li>
                <li className="text-gray-300">Jane Doe</li>
                <li className="text-gray-300">Alice</li>
              </ul>
            </div>
          )}

          {activeTab === "servers" && (
            <div>
              <h3 className="text-lg font-semibold">Servers</h3>
              <ul className="mt-2">
                <li className="text-gray-300">Batch 22</li>
                <li className="text-gray-300">Gaming Hub</li>
              </ul>
            </div>
          )}
        </div>

        {/* if user wants to add social media icons to contact there they can choose and add accordingly */}
        <div className="flex justify-center gap-6 border-t border-gray-700 pt-4 mt-auto">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub className="text-gray-300 text-2xl hover:text-white" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin className="text-gray-300 text-2xl hover:text-white" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer">
            <FaInstagram className="text-gray-300 text-2xl hover:text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;

