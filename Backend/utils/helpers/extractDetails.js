const generateRandomPassword = require("./passwordGenerator");

function extractDetailsFromEmail(profile) {
  // console.log("Extracting details from: ", profile);                 //FOR DEBUGGING ONLY
  const profileTokens = profile.name.familyName.split(" ");
  // console.log("Profile Tokens", profileTokens);                      //FOR DEBUGGING ONLY

  return {
    name: profile.name.givenName,
    email: profile.emails?.[0]?.value,
    username: profile.emails?.[0]?.value.split("@")[0],
    password: generateRandomPassword(8),
    roll_no: profile.emails?.[0]?.value.split("@")[0],
    degree_name: profileTokens[0],
    batch: profileTokens[1],
    campus: profileTokens[4],
  };

  return User;
}

module.exports = extractDetailsFromEmail;
