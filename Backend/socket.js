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

      // Leave group room
      socket.on("leaveGroup", (groupId) => {
        socket.leave(groupId);
        console.log(`User left group room: ${groupId}`);
      });

      // Handle group messages
      socket.on("sendGroupMessage", (data) => {
        io.to(data.groupId).emit("receiveGroupMessage", data);
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
