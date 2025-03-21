const { signUp } = require("../controllers/userController");

const testGoogleAuth = async (req, res) => {
  try {
    console.log("📨 Received Google Auth Test Request:", req.body);

    // Attach user data to req.user (same structure as in userController)
    req.user = {
      emails: [{ value: req.body.email }],
      name: {
        familyName: req.body.familyName,
        givenName: req.body.givenName,
      },
    };

    // Call signUp directly
    await signUp(req, res);
  } catch (error) {
    console.error("❌ Error in testGoogleAuth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { testGoogleAuth };
