const { Router } = require("express");
const friendsRoutes = require("./friendsRoutes");
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
  searchUserByName
} = require("../controllers/userController");
const { testGoogleAuth } = require("../test/googleAuth");
const checkForAuthentication = require("../middleware/userMiddleware");
console.log("Hello from userRoutes.js");

const router = Router();

//OAuth Routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback, signup);
router.post("/auth/google/test", testGoogleAuth);

//Unprotected Publicly Accessible User Routes
router.post("/signin", signin);
router.get("/logout", logout);
router.get("/search", searchUserByName);

//Protected Routes(Below are all the routes that would require user to be signed in before accesing)
// router.use(checkForAuthentication("token"));
router.get("/profile", getUserProfile);
router.use("/friends", friendsRoutes);
router.post("/block/:userIdToBlock", blockUser);
router.post("/unblock/:blockedUserId", unblockUser);

module.exports = router;
