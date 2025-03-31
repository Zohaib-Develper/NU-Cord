const { Router } = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
} = require("../controllers/friendsController");

const router = Router();

router.post("/send/:receiverId", sendFriendRequest);
router.post("/accept/:senderId", acceptFriendRequest);
router.post("/reject/:senderId", rejectFriendRequest);
router.post("/cancel/:receiverId", cancelFriendRequest);
router.delete("/remove/:friendId", removeFriend);


module.exports = router;