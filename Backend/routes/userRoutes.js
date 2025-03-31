const { Router } = require("express");
const {
  googleAuth,
  googleAuthCallback,
} = require("../middleware/authMiddleware");
const {
  signup,
  signin,
  logout,
  getUserProfile,
  blockUser,
  unblockUser,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} = require("../controllers/userController");
const { testGoogleAuth } = require("../test/googleAuth");
const checkForAuthentication = require("../middleware/userMiddleware");

const router = Router();

//OAuth Routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback, signup);
router.post("/auth/google/test", testGoogleAuth);

//Unprotected Publicly Accessible User Routes
router.post("/signin", signin);
router.get("/logout", logout);

//Protected Routes(Below are all the routes that would require user to be signed in before accesing)
router.use(checkForAuthentication("token"));
router.get("/profile", getUserProfile);
router.post("/block/:userIdToBlock", blockUser);
router.post("/unblock/:blockedUserId", unblockUser);
router.post("/friends/send/:receiverId", sendFriendRequest);
router.post("/friends/accept/:senderId", acceptFriendRequest);
router.post("/friends/reject/:senderId", rejectFriendRequest);
router.delete("/friends/remove/:friendId", removeFriend);

module.exports = router;
