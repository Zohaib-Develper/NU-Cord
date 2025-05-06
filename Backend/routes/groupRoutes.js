const { Router } = require("express");
const { Protect, RestrictTo } = require("./../middleware/authMiddleware");
const {
  createGroup,
  joinGroup,
  approveJoinRequest,
  rejectJoinRequest,
  leaveGroup,
  deleteGroup,
  getAllGroups,
  kickMember,
  updateGroupName,
  updateGroupCover,
  generateNewJoiningCode,
} = require("./../controllers/groupController");
const chatController = require("../controllers/chatController");
const router = Router();

router.get("/", Protect, getAllGroups);
router.route("/").post(Protect, chatController.upload, createGroup);
router.delete("/:groupId", Protect, deleteGroup);
router.post("/join", Protect, joinGroup);
router.post("/:groupId/requests/:userId/approve", Protect, approveJoinRequest);
router.post("/:groupId/requests/:userId/reject", Protect, rejectJoinRequest);
router.delete("/:groupId/leave", Protect, leaveGroup);
router.post("/:groupId/kick/:userId", Protect, kickMember);

// New group settings routes
router.patch("/:groupId/name", Protect, updateGroupName);
router.patch("/:groupId/cover", Protect, chatController.upload, updateGroupCover);
router.post("/:groupId/generate-code", Protect, generateNewJoiningCode);

router.route("/").post(Protect, createGroup);
router.route("/all").get(getAllGroups);
router.delete("/:groupId", deleteGroup);
router.post("/join", Protect, joinGroup);
router.post("/:groupId/requests/:userId/approve", Protect, approveJoinRequest);
router.post("/:groupId/requests/:userId/reject", Protect, rejectJoinRequest);
router.delete("/:groupId/leave", Protect, leaveGroup);

module.exports = router;
