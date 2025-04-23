const User = require("../models/user");
const Server = require("../models/server");
const { signupService, signinService } = require("../services/userService");
const { registerUserToServer } = require("../services/serverService");
const { validateToken } = require("../utils/authentication/auth");

const signup = async (req, res) => {
  try {
    const result = await signupService(req.user);

    if (result.status === "new") {
      const updatedUser = await registerUserToServer(result.user._id);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res.redirect("http://localhost:5173/home");
    } else if (result.status === "existing") {
      if (validateToken(result.token)) {
        res.cookie("token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return res.redirect("http://localhost:5173/home");
      } else {
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    return res.status(400).json({ error: "Unexpected signup response" });
  } catch (error) {
    console.error("❌ Error in signup:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("🔐 Attempting sign in:", username);

    const token = await signinService({ username, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const user = await User.findOne({ username })
      .populate("friends")
      .populate("friendRequestsReceived")
      .populate("friendRequestsSent")
      .populate("blockedUsers")
      .populate("servers")
      .populate("requested_servers")
      .populate("groups");

    res.redirect("http://localhost:5173/home");
  } catch (error) {
    console.error("❌ Error in sign in:", error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Internal Server Error" });
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

    //Unfriend the blocked user
    user.friends = user.friends.filter((id) => id.toString() !== userIdToBlock);
    blockedUser.friends = blockedUser.friends.filter(
      (id) => id.toString() !== userId
    );

    //Remove any pending friend requests
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

    //Add to blocked users list
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

    //Check if the user is actually blocked
    if (!user.blockedUsers.includes(blockedUserId)) {
      return res.status(400).json({ error: "User is not blocked" });
    }

    //Remove from blocked list
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

const logout = (req, res) => {
  try {
    if (req.cookies.token) {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      console.log("🚪 Logged out successfully");
      return res.status(200).json({ message: "Logged out successfully" });
    } else {
      return res.status(200).json({ message: "User already logged out" });
    }
  } catch (error) {
    console.error("❌ Error in logout:", error);
    return res.status(500).json({ error: error.message || "Logout failed" });
  }
};

const searchUserByName = async (req, res) => {
  try {
    console.log("Hello from searchUserByName");

    const { name } = req.query;
    const users = await User.find({
      name: { $regex: name, $options: "i" },
    }).limit(10);
    // console.log(users);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for user:", error);
    res.status(500).json({ error: "Failed to search for user" });
  }
};

module.exports = {
  signup,
  signin,
  logout,
  getUserProfile,
  blockUser,
  unblockUser,
  searchUserByName,
};
