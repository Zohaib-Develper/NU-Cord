const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    campus: { type: Schema.Types.ObjectId, ref: "Campus", required: true },
    batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    academicDegree: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDegree",
      required: true,
    },
    major: { type: Schema.Types.ObjectId, ref: "Major", required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
