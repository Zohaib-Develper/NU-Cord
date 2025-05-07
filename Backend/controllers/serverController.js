const Server = require("../models/server");
const User = require("../models/user");
const Channel = require("../models/channel");
const { registerUserToServer } = require("../services/serverService");

const registerUserToServerController = async (req, res) => {
  const { serverID, userID } = req.body;
};

const getServers = async (req, res) => {
  try {
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

const addUserToServer = async (req, res) => {
  const { serverId } = req.params;
  const { userId } = req.body;

  try {
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already in the server
    if (server.users.includes(userId)) {
      return res.status(400).json({ message: "User is already in the server" });
    }

    server.users.push(userId);
    await server.save();

    res.status(200).json({ message: "User added to server successfully" });
  } catch (error) {
    console.error("Error adding user to server:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addChannelToServer = async (req, res) => {
  const { serverId } = req.params;
  const { name } = req.body;

  try {
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = new Channel({
      name,
      server: serverId
    });

    await channel.save();
    server.channels.push(channel._id);
    await server.save();

    res.status(201).json({ 
      message: "Channel added successfully",
      channel 
    });
  } catch (error) {
    console.error("Error adding channel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllChannelsInServer = async (req, res) => {
  const { serverId } = req.params;
  try {
    const server = await Server.findById(serverId).populate("channels");
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    res.status(200).json({ channels: server.channels });
  } catch (error) {
    console.error("Error fetching channels in server:", error);
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
  addUserToServer,
  addChannelToServer,
  getAllChannelsInServer
};
