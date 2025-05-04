import React from "react";
import Modal from "./Modal";

const ServerProfileModal = ({ server, onClose, isJoined, onJoin, onLeave }) => {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{server.name}</h2>
        <p className="text-gray-400 mt-2">{server.description}</p>

        {isJoined ? (
          <button
            onClick={() => onLeave(server._id)}
            className="mt-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Leave Server
          </button>
        ) : (
          <button
            onClick={() => onJoin(server._id)}
            className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Join Server
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ServerProfileModal;