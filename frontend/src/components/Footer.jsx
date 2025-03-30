import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-[#5e17eb]">Features</a>
          <a href="#" className="hover:text-[#5e17eb]">FAQs</a>
          <a href="#" className="hover:text-[#5e17eb]">Contact Us</a>
          <a href="#" className="hover:text-[#5e17eb]">Privacy Policy</a>
        </div>
        <div className="flex justify-center space-x-6 mt-6">
          <a href="#" className="text-gray-400 hover:text-blue-700 text-2xl">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 text-2xl">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-700 text-2xl">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-500 text-2xl">
            <FaLinkedin />
          </a>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">© 2025 NU-Cord. Not affiliated with FAST-NUCES. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
