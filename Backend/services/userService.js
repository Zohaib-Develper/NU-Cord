const bcrypt = require("bcryptjs");
const User = require("../models/user");
const encryptPassword = require("../utils/helpers/encryptPassword");
const extractDetailsFromEmail = require("../utils/helpers/extractDetails");
const isValidFastNuEmail = require("../utils/validators/emailValidator");

const signupService = async (userProfile) => {
  const validEmail = isValidFastNuEmail(userProfile.emails?.[0]?.value);
  if (!validEmail) {
    console.error("Authentication failed: Invalid Email");
    throw new Error("Authentication failed: Invalid Email");
  }

  const userDetails = extractDetailsFromEmail(userProfile);
  let user = await User.findOne({ email: userDetails.email });

  if (!user) {
    console.log("✅ User does not exist, creating new user.");
    console.log("Password aloted to User:", userDetails.password);              //For testing purposes only.
    userDetails.password = await encryptPassword(userDetails.password);

    user = await User.create(userDetails);

    console.log(`🎉 New user created: ${user.username}`);
  } else {
    console.log(`👤 User already exists: ${user.username}`);
  }

  return { user };
};

const signinService = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw { statusCode: 400, message: "Invalid email" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { statusCode: 400, message: "Invalid password" };
  }

  console.log(`✅ User signed in: ${user.username}`);

  return user;
};

module.exports = { signupService, signinService };
