const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConfig.js");
const userRoutes = require("./routes/userRoutes.js");
const groupRoutes = require("./routes/groupRoutes.js");
const friendRoutes = require("./routes/friendsRoutes.js");
const channelRoutes = require("./routes/channelRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js"); // Import chat routes
const Chat = require("./models/Chat.js");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// DB Connection
connectDB();

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("registerUser", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("sendDirectMessage", async ({ senderId, receiverId, text }) => {
    await Chat.create({
      text: text,
      receiver: receiverId,
      sender: senderId,
    });

    const receiverSocket = users.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveDirectMessage", {
        senderId,
        text,
      });
    }
  });

  // Join group (room)
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
  });

  // Group message
  socket.on("groupMessage", ({ groupId, senderId, message }) => {
    // Broadcast to all sockets in the group except sender
    socket.to(groupId).emit("receiveGroupMessage", {
      senderId,
      message,
    });
  });
  // Listen for the 'send_message' event
  socket.on("send_message", async (data) => {
    try {
      // Save the message in the database
      const newChat = await Chat.create({
        text: data.text,
        recieverId: data.recieverId,
      });

      // Emit the message to all clients (broadcast it)
      io.emit("receive_message", {
        _id: newChat._id,
        sender: newChat.sender,
        text: newChat.text,
        channelId: newChat.channelId,
        createdAt: newChat.createdAt,
      });
    } catch (error) {
      console.error("❌ Error saving chat:", error);
    }
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
