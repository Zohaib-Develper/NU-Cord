import React from "react";
import Modal from "./Modal";

const UserProfileModal = ({ user, onClose, isFriend, onAddFriend, onUnfriend }) => {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <img
          src={user.pfp}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="text-sm text-gray-400">Batch: {user.batch}</p>
        {console.log("Selected user:", user)}
        {isFriend ? (
          <button
            onClick={() => onUnfriend(user._id)}
            className="mt-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Unfriend
          </button>
        ) : (
          <button
            onClick={() => onAddFriend(user._id)}
            className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Friend
          </button>
        )}
      </div>
    </Modal>
  );
};

export default UserProfileModal;