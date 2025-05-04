let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      // Join group room
      socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`User joined group room: ${groupId}`);
      });

      // Join server channel room
      socket.on("joinServerChannel", (channelId) => {
        socket.join(channelId);
        console.log(`User joined server channel room: ${channelId}`);
      });

      // Leave group room
      socket.on("leaveGroup", (groupId) => {
        socket.leave(groupId);
        console.log(`User left group room: ${groupId}`);
      });

      // Handle group messages
      socket.on("sendGroupMessage", (data) => {
        io.to(data.groupId).emit("receiveGroupMessage", data);
      });

      // Handle server messages (not used for uploads, but for completeness)
      socket.on("sendServerMessage", (data) => {
        io.to(data.channelId).emit("receiveServerMessage", data);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
