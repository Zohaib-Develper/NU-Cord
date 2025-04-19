const { Router } = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
} = require("../controllers/friendsController");
const {Protect} = require("../middleware/authMiddleware");
console.log("Hello from friendsRoutes.js");

const router = Router();
// '/api/friend/--'
router.post("/send/:receiverId", Protect, sendFriendRequest);
router.post("/accept/:senderId", Protect, acceptFriendRequest);
router.post("/reject/:senderId", rejectFriendRequest);
router.post("/cancel/:receiverId", cancelFriendRequest);
router.delete("/remove/:friendId", removeFriend);


module.exports = router;