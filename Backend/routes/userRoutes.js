const { Router } = require("express");
const { googleAuth, googleAuthCallback } = require("../middleware/authMiddleware");
const { signup, signin, logout } = require("../controllers/userController");
const { testGoogleAuth } = require("../test/googleAuth");

const router = Router();

router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback, signup);
router.post("/auth/google/test", testGoogleAuth);

router.post("/signin", signin);
router.get("/logout", logout);

module.exports = router;