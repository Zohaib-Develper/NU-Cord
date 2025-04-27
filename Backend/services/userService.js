const bcrypt = require("bcryptjs");
const User = require("../models/user");
const encryptPassword = require("../utils/helpers/encryptPassword");
const extractDetailsFromEmail = require("../utils/helpers/extractDetails");
const isValidFastNuEmail = require("../utils/validators/emailValidator");
const { createTokenForUser } = require("../utils/authentication/auth");

const signupService = async (userProfile) => {
  const validEmail = isValidFastNuEmail(userProfile.email);
  if (!validEmail) {
    console.error("❌ Authentication failed: Invalid Email");
    throw { statusCode: 400, message: "Invalid Email" };
  }

  const userDetails = extractDetailsFromEmail(userProfile);
  console.log("📥 Extracted user details:", userDetails);

  let user = await User.findOne({ email: userDetails.email });
  console.log("USER: ", userDetails);

  if (!user) {
    console.log("✅ User does not exist, creating new user.");

    userDetails.password = await encryptPassword(userDetails.password);
    user = await User.create(userDetails);

    console.log(`🎉 New user created: ${user.username}`);
    return { status: "new", user };
  } else {
    console.log(`👤 User already exists: ${user.username}. Signing in...`);
    const token = await signinExistingUser(user);
    return { status: "existing", token };
  }
};

const signinService = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) {
    console.log("❌ User not found.");
    throw { statusCode: 400, message: "Invalid username" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log("❌ Invalid password.");
    throw { statusCode: 400, message: "Invalid password" };
  }

  return createTokenForUser(user);
};

const signinExistingUser = async (user) => {
  const token = createTokenForUser(user);
  console.log(`✅ User signed in: ${user.username}`);
  return token;
};

module.exports = { signupService, signinService, signinExistingUser };
