const Server = require("../models/server");
const User = require("../models/user");
const Channel = require("../models/channel");
const { registerUserToServer } = require("../services/serverService");

const registerUserToServerController = async (req, res) => {
  const { serverID, userID } = req.body;
};

const requestToJoinServer = async (req, res) => {
  const { serverId } = req.params;
  const userId = req.user._id; // Assuming user ID is available via middleware (e.g., JWT auth)

  try {
    const server = await Server.findById(serverId);

    if (!server) {
      return res.status(404).json({ message: "Server not found." });
    }

    // Check if user is already a member
    if (server.users.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this server." });
    }

    // Check if user has already requested to join
    if (server.joining_requests.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already requested to join this server." });
    }

    // Add user to joining_requests
    server.joining_requests.push(userId);
    await server.save();

    res.status(200).json({ message: "Join request sent successfully." });
  } catch (error) {
    console.error("Error requesting to join server:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

const getServers = async (req, res) => {
  try {
    console.log("Hello from Servers controller");
    // console.log("User ID:", req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const populatedUser = await User.findById(req.user._id).populate({
      path: "servers",
      populate: { path: "channels", model: "Channel" },
    });
    // console.log("User's servers after populate:", populatedUser.servers);
    if (!populatedUser.servers || populatedUser.servers.length === 0) {
      console.log("No servers found for user");
      return res.status(200).json({ servers: [] });
    }
    res.status(200).json({ servers: populatedUser.servers });
  } catch (err) {
    console.log("Error at backend: ", err);
    res.status(500).json({ error: "Error fetching servers" });
  }
};

const getAllServers = async (req, res) => {
  try {
    const servers = await Server.find({}).populate("channels");
    res.status(200).json({ servers });
  } catch (error) {
    console.error("Error fetching servers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsersInServer = async (req, res) => {
  const { serverId } = req.params;
  try {
    const server = await Server.findById(serverId).populate("users");
    console.log(server);

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    res.status(200).json({ users: server.users });
  } catch (error) {
    console.error("Error fetching users in server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeUserFromServer = async (req, res) => {
  const { serverId, userId } = req.params;
  try {
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    server.users = server.users.filter((user) => user.toString() !== userId);
    await server.save();
    res.status(200).json({ message: "User removed from server" });
  } catch (error) {
    console.error("Error removing user from server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteServer = async (req, res) => {
  const { serverId } = req.params;
  try {
    const server = await Server.findByIdAndDelete(serverId);
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    res.status(200).json({ message: "Server deleted successfully" });
  } catch (error) {
    console.error("Error deleting server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getServers,
  registerUserToServerController,
  getAllServers,
  getAllUsersInServer,
  removeUserFromServer,
  deleteServer,
  requestToJoinServer,
};
