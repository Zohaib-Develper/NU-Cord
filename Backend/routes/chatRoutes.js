const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController.js");
const { Protect } = require("../middleware/authMiddleware.js");

router.get(
  "/directmessages/:receiverId",
  Protect,
  chatController.getDirectMessages
);

router.post("/send", Protect, chatController.saveMessage);

// Add new routes for message deletion
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
