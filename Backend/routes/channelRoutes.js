const { Router } = require("express");
const router = Router();
const { Protect, RestrictTo } = require("./../middleware/authMiddleware");
const {
  createChannel,
  getAllChannels,
  getChannelById,
  deleteChannel,
} = require("./../controllers/channelController");
const { getServers } = require("../controllers/serverController");

// /api/server/
router.get("/", Protect, getServers);
router
  .route("/:serverId/channel")
  .post(Protect, RestrictTo(""), createChannel)
  .get(Protect, getAllChannels);
router
  .route("/:serverId/channel/:channelId")
  .get(Protect, getChannelById)
  .delete(Protect, deleteChannel);

module.exports = router;
