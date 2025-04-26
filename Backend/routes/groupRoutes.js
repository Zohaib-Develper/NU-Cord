const { Router } = require("express");
const { Protect, RestrictTo } = require("./../middleware/authMiddleware");
const {
  createGroup,
  joinGroup,
  approveJoinRequest,
  rejectJoinRequest,
  leaveGroup,
  deleteGroup,
  getGroups,
} = require("./../controllers/groupController");
const router = Router();

router.get("/", Protect, getGroups);
router.route("/").post(Protect, createGroup);
router.delete("/:groupId", Protect, deleteGroup);
router.get("/join/:inviteCode", Protect, joinGroup);
router.post("/:groupId/requests/:userId/approve", Protect, approveJoinRequest);
router.post("/:groupId/requests/:userId/reject", Protect, rejectJoinRequest);
router.delete("/:groupId/leave", Protect, leaveGroup);

module.exports = router;
