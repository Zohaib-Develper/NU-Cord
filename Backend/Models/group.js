const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupSchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    joining_restriction: { type: String, enum: ["allowed", "adminApproval"] },
    joining_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    coverImageURL: { type: String, default: "/images/batchpfp.png" },
    inviteURL: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);