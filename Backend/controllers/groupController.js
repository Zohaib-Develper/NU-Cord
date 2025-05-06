const user = require("../models/user");
const Group = require("../models/group");
const mongoose = require("mongoose");

const getGroups = async (req, res) => {
  try {
    const userWithGroups = await user.findById(req.user._id).populate({
      path: "groups",
      populate: { path: "users", model: "User", select: "name pfp" },
    });

    if (!userWithGroups) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ groups: userWithGroups.groups || [] });
  } catch (err) {
    console.log("Error at backend: ", err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, joining_restriction, coverImageURL, description } = req.body;

    // Generate a unique 8-character alphanumeric code
    let joining_code;
    let isUnique = false;
    while (!isUnique) {
      joining_code = Math.random().toString(36).substring(2, 10);
      const exists = await Group.findOne({ joining_code });
      if (!exists) isUnique = true;
    }

    let coverImage = coverImageURL;
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    const group = await Group.create({
      admin: req.user._id,
      name,
      users: [req.user._id],
      joining_restriction,
      coverImageURL: coverImage,
      joining_code,
      description,
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

const joinGroup = async (req, res) => {
  try {
    const { code } = req.body;
    const group = await Group.findOne({ joining_code: code });
    // console.log("Group: ", group);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    if (group.users.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group." });
    }
    if (group.joining_restriction === "adminApproval") {
      if (group.joining_requests.includes(req.user._id)) {
        return res.status(400).json({ message: "You have sent approval request to join the group. Contact the group admin to add you." });
      }
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

    if (
      req.user.role !== "ADMIN" &&
      group.admin.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: "Access denied. Only the group admin can delete this group.",
      });
    }

    // Delete group
    await Group.findByIdAndDelete(groupId);

    // Remove group reference from users if applicable
    await user.updateMany({ groups: groupId }, { $pull: { groups: groupId } });

    res.status(200).json({
      status: "success",
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Failed to delete group" });
  }
};

const getAllGroups = async (req, res) => {
  try {
    let userId = req.user._id;
    // Convert to ObjectId only if it's a string
    if (typeof userId === "string") {
      userId = mongoose.Types.ObjectId(userId);
    }
    const groups = await Group.find({
      $or: [{ admin: userId }, { users: userId }],
    })
      .populate("admin", "name")
      .populate("users", "name pfp")
      .populate("joining_requests", "name username");
    res.status(200).json({
      status: "success",
      groups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

const kickMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only admin can kick members" });
    }
    if (userId === group.admin.toString()) {
      return res.status(400).json({ error: "Admin cannot kick themselves" });
    }
    if (!group.users.includes(userId)) {
      return res.status(400).json({ error: "User is not a member of this group" });
    }
    group.users = group.users.filter((id) => id.toString() !== userId);
    await group.save();
    res.status(200).json({ status: "success", message: "Member kicked successfully", group });
  } catch (error) {
    console.error("Error kicking member:", error);
    res.status(500).json({ error: "Failed to kick member" });
  }
};

const updateGroupName = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only admin can change group name" });
    }
    group.name = name;
    await group.save();
    res.status(200).json({ status: "success", group });
  } catch (error) {
    res.status(500).json({ error: "Failed to update group name" });
  }
};

const updateGroupCover = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only admin can change group cover image" });
    }
    if (req.file) {
      group.coverImageURL = `/uploads/${req.file.filename}`;
      await group.save();
      return res.status(200).json({ status: "success", group });
    } else {
      return res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update group cover image" });
  }
};

const generateNewJoiningCode = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only admin can generate new code" });
    }
    let joining_code;
    let isUnique = false;
    while (!isUnique) {
      joining_code = Math.random().toString(36).substring(2, 10);
      const exists = await Group.findOne({ joining_code });
      if (!exists) isUnique = true;
    }
    group.joining_code = joining_code;
    await group.save();
    res.status(200).json({ status: "success", group });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate new joining code" });
  }
};

module.exports = {
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
};
