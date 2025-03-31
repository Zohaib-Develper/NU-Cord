const { Router } = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} = require("../controllers/friendsController");

const router = Router();

router.post("/send/:receiverId", sendFriendRequest);
router.post("/accept/:senderId", acceptFriendRequest);
router.post("/reject/:senderId", rejectFriendRequest);
router.delete("/remove/:friendId", removeFriend);

module.exports = router;