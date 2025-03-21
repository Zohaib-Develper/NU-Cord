const passport = require("passport");
const { signupService } = require("../services/userService");
const { signup } = require("../controllers/userController");

const googleAuthCallback = passport.authenticate("google", { session: false });

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

module.exports = {
  googleAuth,
  googleAuthCallback,
};