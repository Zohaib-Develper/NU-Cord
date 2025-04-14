const JWT = require("jsonwebtoken");

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    pfp: user.pfp,
    email: user.email,
    username: user.username,
    batch: user.batch,
    campus: user.campus,
    roll_no: user.roll_no,
    degree_name: user.degree_name,
    role: user.role,
    friends: user.friends,
    friendRequestsReceived: user.friendRequestsReceived,
    servers: user.servers,
    groups: user.groups,
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
