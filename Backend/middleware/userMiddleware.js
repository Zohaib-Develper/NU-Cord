const { validateToken } = require("../utils/authentication/auth");

function checkForAuthentication(token) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[token];

    if (!tokenCookieValue) {
      console.log("No cookie found in user request. Blocking access.");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      console.log("Token Validated for user with payload", userPayload);
      if (userPayload) {
        req.user = userPayload;
        return next();
      }
    } catch (error) {
      console.log("Token validation failed:", error);
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
  };
}

module.exports = checkForAuthentication