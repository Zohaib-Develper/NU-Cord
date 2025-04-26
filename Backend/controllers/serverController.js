const { registerUserToServer } = require("../services/serverService");

const registerUserToServerController = async (req, res) => {
  const { serverID, userID } = req.body;
};
const getServers = async (req, res) => {
  try {
    console.log("Hello from Servers controller");
    const servers = await user.findById(req.user._id).populate({
      path: "servers",
      populate: { path: "channels", model: "Channel" },
    }).groups;
    res.status(200).json({ servers });
  } catch (err) {
    console.log("Error at backend: ", err);
  }
};

module.exports = { registerUserToServerController, getServers };
