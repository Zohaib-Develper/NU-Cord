const Chat = require("../models/Chat.js");

exports.saveMessage = async (req, res) => {
  const { text } = req.body;

  try {
    let newChat;
    if ("receiverId" in req.body) {
      newChat = await Chat.create({
        sender: req.user._id,
        text: text,
        receiver: req.body.receiverId,
      });
    } else if ("channelId" in req.body) {
      newChat = await Chat.create({
        sender: req.user._id,
        text: text,
        channel: req.body.channelId,
      });
    } else if ("groupId" in req.body) {
      newChat = await Chat.create({
        sender: req.user._id,
        text: text,
        group: req.body.groupId,
      });
    }
    // Return the saved chat message
    res.status(200).json(newChat);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
};

exports.getDirectMessages = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const messages = await Chat.find({
      $or: [{ receiver: receiverId }, { sender: req.user._id }],
    })
      .sort({
        createdAt: 1,
      })
      .populate("receiver");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Chat.find({ group: groupId })
      .sort({
        createdAt: 1,
      })
      .populate("sender");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.getChannelMessages = async (req, res) => {
  const { channelId } = req.params;

  try {
    const messages = await Chat.find({ channel: channelId })
      .sort({
        createdAt: 1,
      })
      .populate("sender");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
