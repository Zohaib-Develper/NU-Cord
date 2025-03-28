const generateRandomPassword = require("./passwordGenerator");

function extractDetailsFromEmail(profile) {
  // console.log("Extracting details from: ", profile);                 //FOR DEBUGGING ONLY
  const profileTokens = profile.family_name.split(" ");
  // console.log("Profile Tokens", profileTokens);                      //FOR DEBUGGING ONLY

  return {
    name: profile.given_name,
    email: profile.email,
    username: profile.email.split("@")[0],
    password: generateRandomPassword(8),
    roll_no: profile.email.split("@")[0],
    degree_name: profileTokens[0],
    batch: profileTokens[1],
    campus: profileTokens[4],
  };

  return User;
}

module.exports = extractDetailsFromEmail;
