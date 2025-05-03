const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { Protect } = require("../middleware/authMiddleware");

router.get(
  "/directmessages/:receiverId",
  Protect,
  chatController.getDirectMessages
);

router.post("/send", chatController.saveMessage);

module.exports = router;
