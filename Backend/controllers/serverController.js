const User = require("../models/user");
const Channel = require("../Models/channel");
const { registerUserToServer } = require("../services/serverService");

const registerUserToServerController = async (req, res) => {
  const { serverID, userID } = req.body;
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

module.exports = { registerUserToServerController, getServers };
