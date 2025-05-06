const { Router } = require("express");
const friendsRoutes = require("./friendsRoutes");
const {
  googleAuth,
  googleAuthCallback,
  Protect,
  RestrictTo,
} = require("../middleware/authMiddleware");
const {
  signup,
  signin,
  logout,
  getUserProfile,
  blockUser,
  unblockUser,
  searchUserByName,
  getAllUsers,
  deleteUser,
  suspendUser,
  unSuspendUser,
  getAllStats,
<<<<<<< HEAD
  verifyAdminAccess,
=======
  updateProfile,
>>>>>>> 1e67eab248521a4ccc195c2ce6630b7d111debb0
} = require("../controllers/userController");
const { testGoogleAuth } = require("../test/googleAuth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = Router();

router.get("/all", getAllUsers);
router.delete("/:userId", deleteUser);
router.post("/suspend/:userId", suspendUser);
router.post("/unSuspend/:userId", unSuspendUser);
router.get("/stats", getAllStats);

//OAuth Routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback, signup);
router.post("/auth/google/test", testGoogleAuth);

//Unprotected Publicly Accessible User Routes
router.post("/signin", signin);
router.get("/logout", logout);
router.get("/search", searchUserByName);

//Protected Routes(Below are all the routes that would require user to be signed in before accesing)
router.use(Protect);
router.get("/profile", getUserProfile);
router.put("/profile", upload.single("pfp"), updateProfile);
router.use("/friends", friendsRoutes);
router.post("/block/:userIdToBlock", blockUser);
router.post("/unblock/:blockedUserId", unblockUser);
router.get("/verify-admin", Protect, RestrictTo("ADMIN"), (req, res) => {
  res.status(200).json({ isAdmin: true, message: "Admin access verified" });
});

module.exports = router;
