require("dotenv").config();

const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  "http://localhost:8000/user/auth/google/callback"
)}&response_type=code&scope=openid%20email%20profile`;

module.exports = { GOOGLE_AUTH_URL };
