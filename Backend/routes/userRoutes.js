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

//Protected Routes(Below all routes would require user to be signed in before accesing that route)
router.use(checkForAuthentication("token")); // Middleware applied to all routes below
router.get("/profile", getUserProfile); //DEMO USAGE (getProfile is a controller)
//FOR TESTING MIDDLEWARE AUTHENTICATION ONLY (REMOVE IN PRODUCTION) 
router.get("/profile", (req, res) => {
  res.json({ message: "User Profile", user: req.user });
});

module.exports = router;
