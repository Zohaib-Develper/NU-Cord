const { Router } = require("express");
const {
  googleAuth,
  googleAuthCallback,
} = require("../middleware/authMiddleware");
const { signUp, signIn, logout } = require("../controllers/userController");
const { testGoogleAuth } = require("../test/googleAuth");

const router = Router();

// Google OAuth Routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback, signUp);
router.post("/auth/google/test", testGoogleAuth);                   //TEST ROUTE FOR GOOGLE AUTH

// Authentication Routes
// router.post("/signIn", signIn);
// router.get("/logout", logout);

module.exports = router;
