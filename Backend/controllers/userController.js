const User = require("../models/user");
const { signupService, signinService } = require("../services/userService");
const { registerUserToServer } = require("../services/serverService");

const signup = async (req, res) => {
  try {

    //Register User in DB
    const { user } = await signupService(req.user);
    if (!user) {
      return res.status(400).json({ error: "User registration failed" });
    }

    // Register User to default Server
    const updatedUser = await registerUserToServer(user._id);
    return res
      .status(200)
      .json({ message: "User registered successfully", updatedUser });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await signinService(email, password);
    res.status(200).json({ message: "Sign in successful", user });
  } catch (error) {
    console.error("Error in sign in:", error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    console.log("Logged out successfully");
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = { signup, signin, logout };
