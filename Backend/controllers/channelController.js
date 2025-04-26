const Channel = require("../Models/channel");
const Server = require("../models/server");

const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params;
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = new Channel({
      owner_server: serverId,
      name: req.body.name,
      coverImageURL: req.body?.coverImageURL || "/images/batchpfp.png",
    });
    await channel.save();

    res.status(201).json({ message: "Channel created successfully", channel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const { serverId, channelId } = req.params;

    const channel = await Channel.findOneAndDelete({
      _id: channelId,
      owner_server: serverId,
    });

    if (!channel) {
      return res
        .status(404)
        .json({ message: "Channel not found or already deleted" });
    }

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Error deleting channel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getChannelById = async (req, res) => {
  try {
    const { serverId, channelId } = req.params;

    const channel = await Channel.findOne({
      _id: channelId,
      owner_server: serverId,
    });

    if (!channel) {
      return res
        .status(404)
        .json({ message: "Channel not found in this server" });
    }

    res.status(200).json({ channel });
  } catch (error) {
    console.error("Error fetching channel:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllChannels = async (req, res) => {
  try {
    const { serverId } = req.params;

    const channels = await Channel.find({ owner_server: serverId });

    if (!channels) {
      return res
        .status(404)
        .json({ message: "No channels found for this server" });
    }

    res.status(200).json({
      status: "success",
      message: "Channels fetched successfully",
      channels,
    });
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createChannel,
  getAllChannels,
  getChannelById,
  deleteChannel,
};
