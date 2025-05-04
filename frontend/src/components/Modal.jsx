import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg p-6 shadow-xl w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
