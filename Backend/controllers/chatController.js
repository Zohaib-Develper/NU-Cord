const Chat = require("../Models/Chat.js");
const { getIO } = require("../socket");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images, PDFs, and text documents are allowed!'));
  }
}).single('file');

exports.upload = upload;

exports.saveMessage = async (req, res) => {
  const { text, receiverId } = req.body;

  try {
    // If there's no text and no file, return error
    if (!text && !req.file) {
      return res.status(400).json({ error: "Message must contain either text or a file" });
    }

    const newChat = await Chat.create({
      sender: req.user._id,
      text: text || "", // Use empty string if no text
      receiver: receiverId,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
    });

    const populatedChat = await Chat.findById(newChat._id).populate("sender");
    const io = getIO();
    const room = [req.user._id, receiverId].sort().join('_');
    io.to(room).emit("receiveDirectMessage", populatedChat);

    res.status(200).json(populatedChat);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
};

exports.getDirectMessages = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    })
      .populate("sender")
      .sort({ createdAt: 1 });

    // Only filter out messages deleted for me
    const filteredMessages = messages.filter((msg) => !msg.deleteFromMe);

    res.status(200).json(filteredMessages);
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

exports.deleteMessageForMe = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Chat.findById(messageId);

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
    await message.save();

    res.status(200).json({ message: "Message deleted for you" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

exports.deleteMessageForEveryone = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Chat.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can delete for everyone
    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Only sender can delete message for everyone" });
    }

    // Replace the message text and set a flag
    message.text = "This message was deleted";
    message.deleteFromEveryone = true;
    await message.save();

    res.status(200).json({ message: "Message deleted for everyone" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
