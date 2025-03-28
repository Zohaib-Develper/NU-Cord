const bcrypt = require("bcryptjs");
const User = require("../models/user");
const encryptPassword = require("../utils/helpers/encryptPassword");
const extractDetailsFromEmail = require("../utils/helpers/extractDetails");
const isValidFastNuEmail = require("../utils/validators/emailValidator");
const { createTokenForUser } = require("../utils/authentication/auth");

const signupService = async (userProfile) => {
  //Validate Email
  const validEmail = isValidFastNuEmail(userProfile.email);
  if (!validEmail) {
    console.error("Authentication failed: Invalid Email");
    throw new Error("Authentication failed: Invalid Email");
  }

  //Extract Details from Email
  const userDetails = extractDetailsFromEmail(userProfile);
  console.log("userDetails", userDetails);
  let user = await User.findOne({ email: userDetails.email });

  if (!user) {
    console.log("✅ User does not exist, creating new user.");

    userDetails.password = await encryptPassword(userDetails.password);

    user = await User.create(userDetails);

    console.log(`🎉 New user created: ${user.username}`);
  } else {
    console.log(`👤 User already exists: ${user.username}`);
  }

  return { user };
};

const signinService = async function (username, password) {
  const user = await User.findOne({ username });

  if (!user) {
    console.log("User not found.");
    throw { statusCode: 400, message: "Invalid username" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { statusCode: 400, message: "Invalid password" };
  }

  const token = createTokenForUser(user);
  console.log(`✅ User signed in: ${user.username}`);
  return token;
};

module.exports = { signupService, signinService };
