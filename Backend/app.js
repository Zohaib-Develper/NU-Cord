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

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/uploads/:filename', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('File not found');
    }
    next();
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Socket.IO logic
const users = new Map(); // Store user IDs and their associated socket IDs

const getDMRoom = (userId1, userId2) => [userId1, userId2].sort().join('_');

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Register user in the map
  socket.on("registerUser", (userId) => {
    if (!userId) {
      console.error("No userId provided for registration");
      return;
    }
    users.set(userId, socket.id); // Save userId and socket.id mapping
    console.log(`User ${userId} registered with socket ${socket.id}`);
    console.log("Current users map:", Array.from(users.entries()));
  });

  // Join DM room (for direct messaging between two users)
  socket.on("joinDM", ({ userId, otherUserId }) => {
    if (!userId || !otherUserId) {
      console.error("Missing userId or otherUserId in joinDM");
      return;
    }
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


  // Group messaging
  socket.on("groupMessage", ({ groupId, senderId, message }) => {
    socket.to(groupId).emit("receiveGroupMessage", { senderId, message });
  });

  // ========= Voice/Video Call Signaling START =========

  // Register call
  socket.on("callUser", ({ from, to, offer, type }) => {
    console.log("\n📞 CALL INITIATION LOGS:");
    console.log("Caller socket ID:", socket.id);
    console.log("Call details:", { from, to, offer, type });
    console.log("Current users map:", Array.from(users.entries()));

    if (!from || !to) {
      console.error("Missing from or to in callUser");
      return;
    }

    const targetSocketId = users.get(to); // Get receiver's socket ID

    if (targetSocketId) {
      console.log(`Sending call to ${to} (socket ${targetSocketId})`);
      io.to(targetSocketId).emit("incomingCall", {
        from,
        offer,
        type,
        to // Include the receiver's ID in the payload
      });
      console.log(`📞 Call sent from ${from} to ${to} (${type})`);
    } else {
      console.log(`❌ Receiver ${to} is not available or not registered.`);
      // Notify the caller that the recipient is unavailable
      io.to(socket.id).emit("callFailed", {
        reason: "Recipient not available",
        to
      });
    }
  });

  // Answering call
  socket.on("answerCall", ({ from, to, answer }) => {
    console.log("\n📞 CALL ANSWER LOGS:");
    console.log("Answer details:", { from, to, answer });
    console.log("Current users map:", Array.from(users.entries()));

    if (!from || !to || !answer) {
      console.error("Missing parameters in answerCall");
      return;
    }

    const targetSocketId = users.get(to); // Get caller's socket ID
    if (targetSocketId) {
      console.log(`Sending answer to ${to} (socket ${targetSocketId})`);
      io.to(targetSocketId).emit("callAnswered", {
        from,
        answer,
        to // Include the caller's ID in the payload
      });
      console.log(`✅ ${from} answered call to ${to}`);
    } else {
      console.log(`❌ Caller ${to} is not available anymore`);
    }
  });

  // ICE Candidate exchange
  socket.on("iceCandidate", ({ to, candidate }) => {
    console.log("\n❄️ ICE CANDIDATE LOGS:");
    console.log("ICE details:", { to, candidate });

    if (!to || !candidate) {
      console.error("Missing parameters in iceCandidate");
      return;
    }

    const targetSocketId = users.get(to);
    if (targetSocketId) {
      console.log(`Sending ICE candidate to ${to} (socket ${targetSocketId})`);
      io.to(targetSocketId).emit("iceCandidate", {
        candidate,
        from: socket.id // Include sender's socket ID
      });
    } else {
      console.log(`❌ Target ${to} is not available for ICE candidate`);
    }
  });

  // End call
  socket.on("endCall", ({ to }) => {
    console.log("\n📞 CALL END LOGS:");
    console.log("End call to:", to);

    if (!to) {
      console.error("Missing to in endCall");
      return;
    }

    const targetSocketId = users.get(to);
    if (targetSocketId) {
      console.log(`Ending call with ${to} (socket ${targetSocketId})`);
      io.to(targetSocketId).emit("callEnded", {
        from: socket.id
      });
      console.log(`🔴 Call ended with ${to}`);
    } else {
      console.log(`❌ Target ${to} is not available to end call`);
    }
  });

  // Clean up when socket disconnects
  socket.on("disconnect", () => {
    console.log("\n🔴 DISCONNECTION LOGS:");
    console.log("Socket disconnecting:", socket.id);

    // Find and remove the disconnected user from the map
    for (let [userId, sockId] of users.entries()) {
      if (sockId === socket.id) {
        users.delete(userId);
        console.log(`Removed user ${userId} from users map`);
        break;
      }
    }
    console.log("Updated users map:", Array.from(users.entries()));
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));