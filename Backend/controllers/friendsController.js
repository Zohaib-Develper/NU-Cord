const User = require("../models/user");
const Server = require("../models/server");

// Sending Friend Requests to Users
const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    if (senderId === receiverId)
      return res.status(400).json({ error: "Cannot send request to yourself" });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ error: "User not found" });

    // Block check: sender or receiver must not have blocked each other
    if (
      sender.blockedUsers.includes(receiverId) ||
      receiver.blockedUsers.includes(senderId)
    ) {
      return res
        .status(403)
        .json({ error: "You cannot send a friend request to this user" });
    }

    // Check if a friend request is already present in either direction
    if (
      sender.friendRequestsSent.includes(receiverId) ||
      receiver.friendRequestsSent.includes(senderId)
    ) {
      return res.status(400).json({
        error:
          "A friend request already exists. Kindly only accept/reject the already present request.",
      });
    }

    sender.friendRequestsSent.push(receiverId);
    receiver.friendRequestsReceived.push(senderId);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

// Accepting Friend Requests of Users
const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.params;
    const receiverId = req.user._id;
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender)
      return res.status(404).json({ error: "User not found" });

    if (!receiver.friendRequestsReceived.includes(senderId))
      return res.status(400).json({ error: "No friend request found" });

    // Remove request from both users' lists
    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
      (id) => id.toString() !== senderId
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (id) => id.toString() !== receiverId
    );

    // Add to friends list
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
};

// Rejecting Friend Request of Users
const rejectFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.params;
    const receiverId = req.user._id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure the receiver actually received a request from the sender
    if (!receiver.friendRequestsReceived.includes(senderId)) {
      return res.status(400).json({ error: "No friend request to reject" });
    }

    // Remove the friend request
    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
      (id) => id.toString() !== senderId
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (id) => id.toString() !== receiverId
    );

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Failed to reject friend request" });
  }
};

// Canceling Sent Friend Request
const cancelFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure the sender actually sent a request to the receiver
    if (!sender.friendRequestsSent.includes(receiverId)) {
      return res
        .status(400)
        .json({ error: "No pending friend request to cancel" });
    }

    // Remove the request from both users' lists
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (id) => id.toString() !== receiverId
    );
    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
      (id) => id.toString() !== senderId
    );

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ error: "Failed to cancel friend request" });
  }
};

// Removing or Unfriending Users
const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ error: "User not found" });

    // Block check: cannot remove a friend if either user is blocked
    if (
      user.blockedUsers.includes(friendId) ||
      friend.blockedUsers.includes(userId)
    ) {
      return res
        .status(403)
        .json({ error: "You cannot remove this user as a friend" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ error: "Failed to remove friend" });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends");
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.log("Error: Getting friends: ", error);
    res.status(500).json({ error: "Error in getting friends" });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  rejectFriendRequest,
  cancelFriendRequest,
  getFriends,
};
