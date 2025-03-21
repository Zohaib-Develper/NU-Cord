const passport = require("passport");
const { signUpService } = require("../services/userService");
const { signUp } = require("../controllers/userController");

const googleAuthCallback = passport.authenticate("google", { session: false });

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

module.exports = {
  googleAuth,
  googleAuthCallback,
};