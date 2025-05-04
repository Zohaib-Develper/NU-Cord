const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Server = require("../models/server");
const { Protect } = require("../middleware/authMiddleware");
router.get("/", Protect, async (req, res) => {
  const { query } = req.query;
  const regex = new RegExp(query, "i");

  // to exclude current user from search results
  const currentUserId = req.user._id;

  try {
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [{ name: regex }, { username: regex }],
    })
      .limit(5)
      .select("name username pfp batch _id");

    const servers = await Server.find({ name: regex })
      .limit(5)
      .select("name _id");

    res.json({ users, servers });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
