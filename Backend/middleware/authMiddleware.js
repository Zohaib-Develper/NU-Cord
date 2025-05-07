const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const googleAuth = (req, res) => {
  res.redirect(require("../config/googleAuth").GOOGLE_AUTH_URL);
};

const googleAuthCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    // Exchange code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:8000/user/auth/google/callback",
        grant_type: "authorization_code",
        code,
      })
    );

    const { access_token } = tokenResponse.data;

    // Fetch user info
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    req.user = userResponse.data; // Attach user data to request object

    next(); // Proceed to `signup function in userController`
  } catch (error) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
};

const Protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from header or cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.log("NOT ALLOWSED:");
      return res.status(401).json({
        error: "You are not logged in! Please log in to get access.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user exists
    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
      return res.status(401).json({
        error: "The user belonging to this token no longer exists.",
      });
    }

    // 4. Block removed users
    if (currentUser.isRemoved) {
      return res.status(403).json({
        error: "You are suspended from the platform. Please contact the administration at nu-cord@gmail.com to resolve the matter"
      });
    }

    // 5. Attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error in Protect middleware:", error.message);
    return res.status(500).json({
      error: "Authentication failed. Please try again.",
    });
  }
};

const RestrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { googleAuth, googleAuthCallback, Protect, RestrictTo };
