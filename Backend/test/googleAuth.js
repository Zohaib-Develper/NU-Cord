const { signup } = require("../controllers/userController");

const testGoogleAuth = async (req, res) => {
  try {
    console.log("📨 Received Google Auth Test Request:", req.body);

    // Attach user data to req.user (same structure as in userController)
    req.user = {
      email: req.body.email,
      family_name: req.body.familyName,
      given_name: req.body.givenName,
    };

    // Call signup directly
    await signup(req, res);
  } catch (error) {
    console.error("❌ Error in testGoogleAuth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { testGoogleAuth };
