// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// require("dotenv").config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:8000/user/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     }
//   )
// );

// // passport.serializeUser((user, done) => done(null, user));
// // passport.deserializeUser((obj, done) => done(null, obj));

require("dotenv").config();

const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  "http://localhost:8000/user/auth/google/callback"
)}&response_type=code&scope=openid%20email%20profile`;

module.exports = { GOOGLE_AUTH_URL };
