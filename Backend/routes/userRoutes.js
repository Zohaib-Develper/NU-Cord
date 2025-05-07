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
  verifyAdminAccess,
  updateProfile,
  removeUser,
  addBackUser,
  permanentlyDeleteUser,
} = require("../controllers/userController");
const { testGoogleAuth } = require("../test/googleAuth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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
router.use(Protect);

// Admin Only Routes
router.get("/all", RestrictTo("ADMIN"), getAllUsers);
router.delete("/:userId", RestrictTo("ADMIN"), deleteUser);
router.post("/suspend/:userId", RestrictTo("ADMIN"), suspendUser);
router.post("/unSuspend/:userId", RestrictTo("ADMIN"), unSuspendUser);
router.post("/remove/:userId", RestrictTo("ADMIN"), removeUser);
router.get("/stats", RestrictTo("ADMIN"), getAllStats);
router.get("/verify-admin", RestrictTo("ADMIN"), (req, res) => {
  res.status(200).json({ isAdmin: true, message: "Admin access verified" });
});
router.post("/addback/:userId", RestrictTo("ADMIN"), addBackUser);
router.delete("/permanent/:userId", RestrictTo("ADMIN"), permanentlyDeleteUser);

// Regular User Routes
router.get("/profile", getUserProfile);
router.put("/profile", upload.single("pfp"), updateProfile);
router.use("/friends", friendsRoutes);
router.post("/block/:userIdToBlock", blockUser);
router.post("/unblock/:blockedUserId", unblockUser);

module.exports = router;
