const Server = require("./server");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    pfp: { type: String, default: "/images/userpfp.png" },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    batch: { type: String, required: true },
    campus: {
      type: String,
      enum: ["ISB", "LHR", "PWR", "KHI", "CFD", "MUL"],
    },
    roll_no: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[lipkfmc]\d{6}$/,
        'Invalid student ID format. It should start with "l", "i", "p", "k", "c" or "m" followed by 6 digits.',
      ],
    },
    degree_name: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      required: true,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
    servers: [{ type: Schema.Types.ObjectId, ref: "Server" }],
    requested_servers: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    requested_groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
