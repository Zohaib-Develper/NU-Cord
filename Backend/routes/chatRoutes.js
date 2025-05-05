const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController.js");
const { Protect } = require("../middleware/authMiddleware.js");

// Direct Messages
router.get(
  "/directmessages/:receiverId",
  Protect,
  chatController.getDirectMessages
);

router.post("/send", Protect, chatController.upload, chatController.saveMessage);

// Group Messages
router.get(
  "/groupmessages/:groupId",
  Protect,
  chatController.getGroupMessages
);

router.post(
  "/group/send",
  Protect,
  chatController.upload,
  chatController.saveGroupMessage
);

// Server Messages
router.get(
  "/servermessages/:channelId",
  Protect,
  chatController.getServerMessages
);

router.post(
  "/server/send",
  Protect,
  chatController.upload,
  chatController.saveServerMessage
);

// Message Deletion
router.delete(
  "/message/:messageId/forme",
  Protect,
  chatController.deleteMessageForMe
);
router.delete(
  "/message/:messageId/foreveryone",
  Protect,
  chatController.deleteMessageForEveryone
);

module.exports = router;
