const JWT = require("jsonwebtoken");

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    roll_no: user.roll_no,
    email: user.email,
    batch: user.batch,
    campus: user.campus,
    degree_name: user.degree_name,
  };
  const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, process.env.JWT_SECRET);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
