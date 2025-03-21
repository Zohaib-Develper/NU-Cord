const { signupService, signinService } = require("../services/userService");
const { registerUserToServer } = require("../services/serverService"); 

const signup = async (req, res) => {
  try {
    const result = await signupService(req.user);
    const user = result.user;

    if (!user) {
      return res.status(400).json({ error: "User registration failed" });
    }

    // Register user to server
    await registerUserToServer(user._id, user.batch, user.major, user.campus);

    return res
      .status(200)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error in signup:", error);

    if (!res.headersSent) {
      return res
        .status(500)
        .json({ error: "Server error", details: error.message });
    }
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await signinService(username, password);
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