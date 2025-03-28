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

module.exports = { googleAuth, googleAuthCallback };