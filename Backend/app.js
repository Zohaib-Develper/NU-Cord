const express = require("express");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/dbConfig.js");
const userRoutes = require("./routes/userRoutes.js");
const groupRoutes = require("./routes/groupRoutes.js");
const friendRoutes = require("./routes/friendsRoutes.js");
const channelRoutes = require("./routes/channelRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const socket = require("./socket");
const Chat = require("./Models/Chat.js");

const app = express();
const server = http.createServer(app);
const io = socket.init(server);

// DB Connection
connectDB();

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Routes
app.use("/user", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/servers", channelRoutes);
app.use("/api/chat", chatRoutes);

const users = new Map();

// Helper to get a unique room name for a DM
const getDMRoom = (userId1, userId2) => [userId1, userId2].sort().join('_');

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("registerUser", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Join a DM room
  socket.on("joinDM", ({ userId, otherUserId }) => {
    const room = getDMRoom(userId, otherUserId);
    socket.join(room);
    console.log(`Socket ${socket.id} joined DM room ${room}`);
  });

  // Delete for everyone in DM
  socket.on("deleteDirectMessageForEveryone", async ({ messageId, senderId, receiverId }) => {
    try {
      const message = await Chat.findById(messageId);
      if (message && message.sender.toString() === senderId) {
        message.deleteFromEveryone = true;
        await message.save();
        const updatedMessage = await Chat.findById(messageId).populate('sender');
        const room = getDMRoom(senderId, receiverId);
        io.to(room).emit("messageDeletedForEveryone", updatedMessage);
      }
    } catch (error) {
      console.error("Error deleting message for everyone:", error);
    }
  });

  // Group message
  socket.on("groupMessage", ({ groupId, senderId, message }) => {
    // Broadcast to all sockets in the group except sender
    socket.to(groupId).emit("receiveGroupMessage", {
      senderId,
      message,
    });
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    for (let [userId, sockId] of users.entries()) {
      if (sockId === socket.id) {
        users.delete(userId);
        break;
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
