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
router.use(checkForAuthentication("token")); //Authentication Middleware applied to all routes below
router.get("/profile", getUserProfile); //Extracts all the data from cookie payload that is required to view user profile

module.exports = router;
