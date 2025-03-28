const User = require("../models/user");
const Server = require("../models/server");
const { signupService, signinService } = require("../services/userService");
const { registerUserToServer } = require("../services/serverService");
const { validateToken } = require("../utils/authentication/auth");
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
    const { username, password } = req.body;
    const token = await signinService(username, password);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Sign in successful", token });
  } catch (error) {
    console.error("Error in sign in:", error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No token provided." });
    }

    // Decode the token and get the user payload
    const user = validateToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    let servers = user.servers || [];

    // Retrieve server names of all servers that the user is part of(servers IDs are stored in DB so below snippet is to get server names from their subsequent IDs)
    servers = await Promise.all(
      servers.map(async (serverId) => {
        const server = await Server.findOne({ _id: serverId });
        return server ? server.name : "Unknown Server";
      })
    );

    res.status(200).json({
      message: "User profile retrieved successfully",
      user: { ...user, servers },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};

const logout = (req, res) => {
  if (req.cookies.token) {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      console.log("Logged Out successfully");
      res.status(200).json({ message: "Logged out successfully" });
    } catch {
      console.error("Error in log out:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  } else res.status(200).json({ message: "User already logged out" });
};

module.exports = { signup, signin, logout, getUserProfile };
