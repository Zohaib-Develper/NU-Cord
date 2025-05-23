const User = require("../models/user");
const Server = require("../models/server");
const Group = require("../models/group");
const Channel = require("../models/channel");
const { signupService, signinService } = require("../services/userService");
const { registerUserToServer } = require("../services/serverService");
const { validateToken } = require("../utils/authentication/auth");

const signup = async (req, res) => {
  try {
    const { email } = req.user;

    // Check if user was previously removed
    const removedUser = await User.findOne({
      $or: [{ email: email, isRemoved: true }],
    });
    if (removedUser) {
      console.log("User was previously removed");
      return res.redirect("http://localhost:5173/deleted");
    }

    // // Check if user already exists
    // const existingUser = await User.findOne({
    //   $or: [{ email }, { roll_no }],
    // });

    // if (existingUser) {
    //   return res.status(400).json({
    //     error: "User with this email or roll number already exists",
    //   });
    // }

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
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Block removed users
    if (user.isRemoved) {
      return res.status(403).json({
        error:
          "You are suspended from the platform. Please contact the administration at nu-cord@gmail.com to resolve the matter",
      });
    }

    const token = await signinService({ username, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const userProfile = await User.findOne({ username })
      .populate("friends")
      .populate("friendRequestsReceived")
      .populate("friendRequestsSent")
      .populate("blockedUsers")
      .populate("servers")
      .populate("requested_servers")
      .populate("groups");

    res.status(200).json({ user: userProfile, token });
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
        _id: user._id,
        name: user.name,
        batch: user.batch,
        pfp: user.pfp,
        campus: user.campus,
        degree_name: user.degree_name,
        username: user.username,
        email: user.email,
        servers,
        friends,
        role: user.role,
        about: user.about,
        socials: user.socials,
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users);

    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isSuspended = true;
    await user.save();

    res.status(200).json({ message: "User suspended successfully" });
  } catch (error) {
    console.error("Error suspending user:", error);
    res.status(500).json({ error: "Failed to suspend user" });
  }
};

const unSuspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isSuspended = false;
    await user.save();

    res.status(200).json({ message: "User unsuspended successfully" });
  } catch (error) {
    console.error("Error unsuspending user:", error);
    res.status(500).json({ error: "Failed to unsuspend user" });
  }
};

const getAllStats = async (req, res) => {
  try {
    const totalUsers = await User.find();
    const totalServers = await Server.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalChannels = await Channel.countDocuments();

    const campuses = [];
    totalUsers.map((user) => {
      if (!campuses.includes(user.campus)) {
        campuses.push(user.campus);
      }
    });

    res.status(200).json({
      totalUsers: totalUsers.length,
      totalServers: totalServers,
      totalCampuses: campuses.length,
      totalGroups: totalGroups,
      totalChannels: totalChannels,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

const verifyAdminAccess = async (req, res) => {
  try {
    // The Protect middleware has already verified the token and attached the user
    // We just need to check if the user has the ADMIN role
    const isAdmin = req.user.role === "ADMIN";

    res.status(200).json({
      isAdmin,
      message: isAdmin ? "Admin access verified" : "User is not an admin",
    });
  } catch (error) {
    console.error("Error verifying admin access:", error);
    res.status(500).json({
      error: "Failed to verify admin access",
    });
  }
};

// Add this function to allow updating about and profile picture
const updateProfile = async (req, res) => {
  try {
    const { about, socials } = req.body;
    let update = {};
    if (about !== undefined) update.about = about;
    if (socials !== undefined) update.socials = socials;
    if (req.file) update.pfp = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
    });
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Mark user as removed instead of deleting
    user.isRemoved = true;
    await user.save();

    res.status(200).json({ message: "User account has been removed" });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ error: "Failed to remove user" });
  }
};

const addBackUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.isRemoved = false;
    await user.save();
    res.status(200).json({ message: "User has been added back" });
  } catch (error) {
    console.error("Error adding back user:", error);
    res.status(500).json({ error: "Failed to add back user" });
  }
};

const permanentlyDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User permanently deleted" });
  } catch (error) {
    console.error("Error permanently deleting user:", error);
    res.status(500).json({ error: "Failed to permanently delete user" });
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
  getAllUsers,
  deleteUser,
  suspendUser,
  unSuspendUser,
  getAllStats,
  verifyAdminAccess,
  updateProfile,
  removeUser,
  addBackUser,
  permanentlyDeleteUser,
};
