const Server = require('./../Models/server')
const { registerUserToServer } = require("../services/serverService");

const registerUserToServerController = async (req, res) => {
    const { serverID, userID } = req.body;
};

const getAllServers = async (req, res) => {
    try {
        const servers = await Server.find({});
        res.status(200).json({ servers });
    } catch (error) {
        console.error("Error fetching servers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUsersInServer = async (req, res) => {
    const { serverId } = req.params;
    try {
        const server = await Server.findById(serverId).populate("users");
        console.log(server);

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }
        res.status(200).json({ users: server.users });
    } catch (error) {
        console.error("Error fetching users in server:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const removeUserFromServer = async (req, res) => {
    const { serverId, userId } = req.params;
    try {
        const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }
        server.users = server.users.filter(user => user.toString() !== userId);
        await server.save();
        res.status(200).json({ message: "User removed from server" });
    } catch (error) {
        console.error("Error removing user from server:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteServer = async (req, res) => {
    const { serverId } = req.params;
    try {
        const server = await Server.findByIdAndDelete(serverId);
        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }
        res.status(200).json({ message: "Server deleted successfully" });
    } catch (error) {
        console.error("Error deleting server:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = { registerUserToServerController, getAllServers, getAllUsersInServer, removeUserFromServer, deleteServer };