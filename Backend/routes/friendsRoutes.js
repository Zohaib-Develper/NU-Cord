const { Router } = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getFriends,
} = require("../controllers/friendsController");
const { Protect } = require("../middleware/authMiddleware");
console.log("Hello from friendsRoutes.js");

const router = Router();
// '/api/friend/--'
router.get("/", Protect, getFriends);
router.post("/send/:receiverId", Protect, sendFriendRequest);
router.post("/accept/:senderId", Protect, acceptFriendRequest);
router.post("/reject/:senderId", Protect, rejectFriendRequest);
router.post("/cancel/:receiverId", Protect, cancelFriendRequest);
router.delete("/remove/:friendId", Protect, removeFriend);

module.exports = router;
