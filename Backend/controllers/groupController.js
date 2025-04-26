const user = require("../models/user");
const Group = require("./../Models/group");

const getGroups = async (req, res) => {
  try {
    console.log("Hello from groups controller");
    const groups = await user.findById(req.user._id).populate({
      path: "groups",
      populate: { path: "users", model: "User" },
    }).groups;
    res.status(200).json({ groups });
  } catch (err) {
    console.log("Error at backend: ", err);
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, joining_restriction, coverImageURL } = req.body;

    const inviteCode = Math.random().toString(36).substring(2, 10); // e.g., "k92g7qf3"
    // const inviteURL = `${req.protocol}://${req.get('host')}/join/${inviteCode}`;

    const group = await Group.create({
      admin: req.user._id,
      name,
      users: [req.user._id],
      joining_restriction,
      coverImageURL,
      inviteURL: inviteCode,
    });

    res.status(201).json({
      status: "success",
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
};
/**
  {
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    joining_restriction: { type: String, enum: ["allowed", "adminApproval"] },
    joining_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    coverImageURL: { type: String, default: "/images/batchpfp.png" },
    inviteURL: { type: String, unique: true },
  },
 */
const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    const group = await Group.findOne({ inviteURL: inviteCode });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.users.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group." });
    }

    if (group.joining_restriction === "adminApproval") {
      group.joining_requests.push(req.user._id);
      await group.save();
      return res
        .status(200)
        .json({ message: "Join request sent successfully" });
    }
    group.users.push(req.user._id);
    await group.save();

    res.status(201).json({
      status: "success",
      message: "Joined group successfully",
      group,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ error: "Failed to join group" });
  }
};

const approveJoinRequest = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Only admin can approve join requests" });
    }

    if (!group.joining_requests.includes(userId)) {
      return res.status(400).json({ error: "User not in join requests" });
    }

    // Avoid duplicate entry
    if (!group.users.includes(userId)) {
      group.users.push(userId);
    }

    group.joining_requests = group.joining_requests.filter(
      (id) => id.toString() !== userId
    );
    await group.save();

    res.status(200).json({
      status: "success",
      message: "Join request approved successfully",
      group,
    });
  } catch (error) {
    console.error("Error approving join request:", error);
    res.status(500).json({ error: "Failed to approve join request" });
  }
};

const rejectJoinRequest = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Only admin of group can reject join requests" });
    }

    if (!group.joining_requests.includes(userId)) {
      return res.status(400).json({ error: "User not in join requests" });
    }

    // Remove user from join requests
    group.joining_requests = group.joining_requests.filter(
      (id) => id.toString() !== userId
    );
    await group.save();

    res.status(200).json({
      status: "success",
      message: "Join request rejected successfully",
      group,
    });
  } catch (error) {
    console.error("Error rejecting join request:", error);
    res.status(500).json({ error: "Failed to reject join request" });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.users.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group." });
    }

    // Prevent admin from leaving directly
    if (group.admin.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message:
          "Group admin cannot leave the group. Please transfer admin rights first.",
      });
    }

    group.users = group.users.filter(
      (user) => user.toString() !== req.user._id.toString()
    );

    await group.save();

    res.status(200).json({
      status: "success",
      message: "Left group successfully",
      group,
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ error: "Failed to leave group" });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Access denied. Only the group admin can delete this group.",
      });
    }

    // Delete group
    await Group.findByIdAndDelete(groupId);

    // Remove group reference from users if applicable
    await User.updateMany({ groups: groupId }, { $pull: { groups: groupId } });

    res.status(200).json({
      status: "success",
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Failed to delete group" });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  approveJoinRequest,
  rejectJoinRequest,
  leaveGroup,
  deleteGroup,
  getGroups,
};
