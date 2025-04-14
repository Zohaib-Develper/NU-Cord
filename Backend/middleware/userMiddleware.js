const { validateToken } = require("../utils/authentication/auth");

function checkForAuthentication(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      console.log("No cookie found in user request.");
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      console.log("Token Validated for user with payload", userPayload);
      if (userPayload) req.user = userPayload;
    } catch (error) {
      console.log(error);
    }
    return next();
  };
}

module.exports = checkForAuthentication;
