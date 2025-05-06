const { Router } = require("express");
const { Protect } = require("../middleware/authMiddleware");
const { getServers } = require("../controllers/serverController");

const router = Router();

// Only return servers the logged-in user is a member of
router.get("/", Protect, getServers);

module.exports = router; 