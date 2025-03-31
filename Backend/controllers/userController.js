const User = require("../models/user");
const Server = require("../models/server");
const { signupService, signinService } = require("../services/userService");
const { registerUserToServer } = require("../services/serverService");
const { validateToken } = require("../utils/authentication/auth");

const signup = async (req, res) => {
  try {
    //Register User in DB
    const { user } = await signupService(req.user);
    if (!user) {
      return res.status(400).json({ error: "User registration failed" });
    }

    // Register User to default Server
    const updatedUser = await registerUserToServer(user._id);
    return res
      .status(200)
      .json({ message: "User registered successfully", updatedUser });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await signinService(username, password);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Sign in successful", token });
  } catch (error) {
    console.error("Error in sign in:", error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

//Retrives all necessary data to be displayed on user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const serverIds = user.servers || [];
    const friendsIds = user.friends || [];

    const [servers, friends] = await Promise.all([
      Server.getServerNames(serverIds),
      User.getUserFriends(friendsIds),
    ]);

    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        name: user.name,
        batch: user.batch,
        pfp: user.pfp,
        campus: user.campus,
        degree_name: user.degree_name,
        username: user.username,
        servers,
        friends,
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};

//Block a User
const blockUser = async (req, res) => {
  try {
    const { userIdToBlock } = req.params;
    const userId = req.user._id;
    if (userId === userIdToBlock)
      return res.status(400).json({ error: "You cannot block yourself" });

    const user = await User.findById(userId);
    const blockedUser = await User.findById(userIdToBlock);
    console.log(blockedUser);

    if (!user || !blockedUser)
      return res.status(404).json({ error: "User not found" });

    // Check if already blocked
    if (user.blockedUsers.includes(userIdToBlock)) {
      return res.status(400).json({ error: "User is already blocked" });
    }

    // 1️⃣ Unfriend the blocked user
    user.friends = user.friends.filter((id) => id.toString() !== userIdToBlock);
    blockedUser.friends = blockedUser.friends.filter(
      (id) => id.toString() !== userId
    );

    // 2️⃣ Remove any pending friend requests
    user.friendRequestsSent = user.friendRequestsSent.filter(
      (id) => id.toString() !== userIdToBlock
    );
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (id) => id.toString() !== userIdToBlock
    );

    blockedUser.friendRequestsSent = blockedUser.friendRequestsSent.filter(
      (id) => id.toString() !== userId
    );
    blockedUser.friendRequestsReceived =
      blockedUser.friendRequestsReceived.filter(
        (id) => id.toString() !== userId
      );

    // 3️⃣ Add to blocked users list
    user.blockedUsers.push(userIdToBlock);

    await user.save();
    await blockedUser.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ error: "Failed to block user" });
  }
};

//Unblock a User
const unblockUser = async (req, res) => {
  try {
    const { blockedUserId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const blockedUser = await User.findById(blockedUserId);

    if (!user || !blockedUser)
      return res.status(404).json({ error: "User not found" });

    // Check if the user is actually blocked
    if (!user.blockedUsers.includes(blockedUserId)) {
      return res.status(400).json({ error: "User is not blocked" });
    }

    // Remove from blocked list
    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== blockedUserId
    );

    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ error: "Failed to unblock user" });
  }
};

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

    if (
      sender.friendRequestsSent.includes(receiverId) ||
      receiver.friendRequestsReceived.includes(senderId)
    ) {
      return res.status(400).json({ error: "Friend request already sent" });
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

    // Block check: sender or receiver must not have blocked each other
    if (
      receiver.blockedUsers.includes(senderId) ||
      sender.blockedUsers.includes(receiverId)
    ) {
      return res
        .status(403)
        .json({ error: "You cannot accept a friend request from this user" });
    }

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

    if (!receiver || !sender)
      return res.status(404).json({ error: "User not found" });

    // Block check: sender or receiver must not have blocked each other
    if (
      receiver.blockedUsers.includes(senderId) ||
      sender.blockedUsers.includes(receiverId)
    ) {
      return res
        .status(403)
        .json({ error: "You cannot interact with this user" });
    }

    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
      (id) => id.toString() !== senderId
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (id) => id.toString() !== receiverId
    );

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Failed to reject friend request" });
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

const logout = (req, res) => {
  if (req.cookies.token) {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      console.log("Logged Out successfully");
      res.status(200).json({ message: "Logged out successfully" });
    } catch {
      console.error("Error in log out:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  } else res.status(200).json({ message: "User already logged out" });
};

module.exports = {
  signup,
  signin,
  logout,
  getUserProfile,
  blockUser,
  unblockUser,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  rejectFriendRequest,
};
