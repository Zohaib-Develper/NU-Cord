const Chat = require("../Models/Chat.js");
const { getIO } = require("../socket");
const multer = require("multer");
const path = require("path");
const Channel = require("../models/channel");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const filetypes = /\.(jpeg|jpg|png|gif|pdf|doc|docx|txt|mp3|wav|ogg|webm)$/i;
const mimetypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
];

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = mimetypes.includes(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Only images, PDFs, text documents, and audio files are allowed!"
      )
    );
  },
}).single("file");

// Add this helper function at the top
const checkSuspendedUser = (user) => {
  if (user.isSuspended) {
    throw new Error("You are suspended from sending any message. Please contact the administration at nu-cord@gmail.com to resolve the matter");
  }
};

function saveMessage(req, res) {
  const { text, receiverId } = req.body;

  try {
    // Check if user is suspended
    checkSuspendedUser(req.user);

    // If there's no text and no file, return error
    if (!text && !req.file) {
      return res
        .status(400)
        .json({ error: "Message must contain either text or a file" });
    }

    Chat.create({
      sender: req.user._id,
      text: text || "", // Use empty string if no text
      receiver: receiverId,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
    })
      .then((newChat) => {
        return Chat.findById(newChat._id).populate("sender");
      })
      .then((populatedChat) => {
        const io = getIO();
        const room = [req.user._id, receiverId].sort().join("_");
        io.to(room).emit("receiveDirectMessage", populatedChat);
        res.status(200).json(populatedChat);
      })
      .catch((error) => {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Failed to save message" });
      });
  } catch (error) {
    console.error("Error saving message:", error);
    if (error.message.includes("suspended")) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to save message" });
  }
}

function getDirectMessages(req, res) {
  const { receiverId } = req.params;

  Chat.find({
    $or: [
      { sender: req.user._id, receiver: receiverId },
      { sender: receiverId, receiver: req.user._id },
    ],
  })
    .populate("sender")
    .sort({ createdAt: 1 })
    .then((messages) => {
      // Only filter out messages deleted for me
      const filteredMessages = messages.filter((msg) => !msg.deleteFromMe);
      res.status(200).json(filteredMessages);
    })
    .catch((error) => {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    });
}

const saveGroupMessage = async (req, res) => {
  const { text, groupId } = req.body;

  try {
    // Check if user is suspended
    checkSuspendedUser(req.user);

    // If there's no text and no file, return error
    if (!text && !req.file) {
      return res
        .status(400)
        .json({ error: "Message must contain either text or a file" });
    }

    const newChat = await Chat.create({
      sender: req.user._id,
      text: text || "", // Use empty string if no text
      group: groupId,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
    });

    const populatedChat = await Chat.findById(newChat._id).populate("sender");

    const io = getIO();
    io.to(groupId).emit("receiveGroupMessage", populatedChat);

    res.status(200).json(populatedChat);
  } catch (error) {
    console.error("Error saving group message:", error);
    if (error.message.includes("suspended")) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to save group message" });
  }
};

const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Chat.find({ group: groupId })
      .populate("sender")
      .sort({ createdAt: 1 });

    // Only filter out messages deleted for me
    const filteredMessages = messages.filter((msg) => !msg.deleteFromMe);
    res.status(200).json(filteredMessages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ error: "Failed to fetch group messages" });
  }
};

function getChannelMessages(req, res) {
  const { channelId } = req.params;

  Chat.find({ channel: channelId })
    .sort({ createdAt: 1 })
    .populate("sender")
    .then((messages) => res.status(200).json(messages))
    .catch((error) => {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    });
}

function deleteMessageForMe(req, res) {
  const { messageId } = req.params;

  Chat.findById(messageId)
    .then((message) => {
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      // Check if the user is either sender or receiver
      if (
        message.sender.toString() !== req.user._id.toString() &&
        message.receiver.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this message" });
      }
      // Set deleteFromMe flag for the current user
      message.deleteFromMe = true;
      return message.save();
    })
    .then(() => res.status(200).json({ message: "Message deleted for you" }))
    .catch((error) => {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    });
}

function deleteMessageForEveryone(req, res) {
  const { messageId } = req.params;

  Chat.findById(messageId)
    .then((message) => {
      if (!message) {
        res.status(404).json({ error: "Message not found" });
        throw new Error("Already sent response");
      }
      // Only sender can delete for everyone
      if (message.sender.toString() !== req.user._id.toString()) {
        res.status(403).json({ error: "Only sender can delete message for everyone" });
        throw new Error("Already sent response");
      }
      // Mark as deleted for everyone
      message.text = "This message was deleted";
      message.deleteFromEveryone = true;
      return message.save();
    })
    .then(async (msg) => {
      if (!msg) return;
      const io = getIO();
      const updatedMessage = await Chat.findById(messageId).populate('sender');
      if (msg.group) {
        io.to(msg.group.toString()).emit("messageDeletedForEveryone", updatedMessage);
      } else if (msg.channel) {
        io.to(msg.channel.toString()).emit("messageDeletedForEveryone", updatedMessage);
      } else if (msg.receiver) {
        const room = [req.user._id, msg.receiver].sort().join("_");
        io.to(room).emit("messageDeletedForEveryone", updatedMessage);
      }
      res.status(200).json({ message: "Message deleted for everyone" });
    })
    .catch((error) => {
      if (error.message === "Already sent response") return;
      console.error("Error in deleteMessageForEveryone:", error);
      res.status(500).json({ error: "Failed to delete message" });
    });
}

const saveServerMessage = async (req, res) => {
  const { text, channelId } = req.body;
  try {
    // Check if user is suspended
    checkSuspendedUser(req.user);

    if (!text && !req.file) {
      return res.status(400).json({ error: "Message must contain either text or a file" });
    }

    // Check if the channel is an announcement channel
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const isAnnouncementChannel = channel.name.toLowerCase().includes('announcement');
    if (isAnnouncementChannel && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only admins can send messages in announcement channels" });
    }

    const newChat = await Chat.create({
      sender: req.user._id,
      text: text || "",
      channel: channelId,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
    });
    const populatedChat = await Chat.findById(newChat._id).populate("sender");
    const io = getIO();
    io.to(channelId).emit("receiveServerMessage", populatedChat);
    res.status(200).json(populatedChat);
  } catch (error) {
    console.error("Error saving server message:", error);
    if (error.message.includes("suspended")) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to save server message" });
  }
};

const getServerMessages = async (req, res) => {
  const { channelId } = req.params;
  try {
    const messages = await Chat.find({ channel: channelId })
      .populate("sender")
      .sort({ createdAt: 1 });
    const filteredMessages = messages.filter((msg) => !msg.deleteFromMe);
    res.status(200).json(filteredMessages);
  } catch (error) {
    console.error("Error fetching server messages:", error);
    res.status(500).json({ error: "Failed to fetch server messages" });
  }
};

module.exports = {
  upload,
  saveMessage,
  saveGroupMessage,
  saveServerMessage,
  getDirectMessages,
  getGroupMessages,
  getServerMessages,
  getChannelMessages,
  deleteMessageForMe,
  deleteMessageForEveryone,
};
