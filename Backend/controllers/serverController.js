const { registerUserToServer } = require("../services/serverService");

const registerUserToServerController = async (req, res) => {
    const {serverID, userID} = req.body;
};

module.exports = { registerUserToServerController };