const { Router } = require("express");
const { Protect } = require("../middleware/authMiddleware");
const { 
  getServers, 
  getAllServers, 
  getAllUsersInServer, 
  removeUserFromServer, 
  deleteServer,
  addUserToServer,
  addChannelToServer,
  getAllChannelsInServer,
  requestToJoinServer,
} = require("../controllers/serverController");
const { deleteChannel } = require("../controllers/channelController");

const router = Router();

// Only return servers the logged-in user is a member of
router.get("/", Protect, getServers);

// Admin routes
router.get("/all", Protect, getAllServers);
router.get("/:serverId/users", Protect, getAllUsersInServer);
router.get("/:serverId/channels", Protect, getAllChannelsInServer);
router.post("/:serverId/addUser", Protect, addUserToServer);
router.delete("/:serverId/removeUser/:userId", Protect, removeUserFromServer);
router.post("/:serverId/channel", Protect, addChannelToServer);
router.delete("/:serverId/channel/:channelId", Protect, deleteChannel);
router.delete("/:serverId", Protect, deleteServer);
router.post("/:serverId/join-request", Protect, requestToJoinServer);

module.exports = router;
