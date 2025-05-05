const Server = require("./server");
const mongoose = require("mongoose");
const urlValidator = require("../utils/validators/urlValidator");
const isValidRollNumber = require("../utils/validators/rollNumberValidator");
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
      validate: [
        isValidRollNumber,
        "Invalid student ID format. It should start with 'l', 'i', 'p', 'k', 'f', or 'm' followed by 6 digits.",
      ],
    },
    degree_name: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      required: true,
    },
    socials: {
      instagram: {
        type: String,
        validate: [urlValidator, "Invalid Instagram URL"],
        default: "www.instagram.com",
      },
      github: {
        type: String,
        validate: [urlValidator, "Invalid GitHub URL"],
        default: "www.github.com",
      },
      linkedin: {
        type: String,
        validate: [urlValidator, "Invalid LinkedIn URL"],
        default: "www.linkedin.com",
      },
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    servers: [{ type: Schema.Types.ObjectId, ref: "Server" }],
    requested_servers: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    isSuspended: {
      type: Boolean,
      default: false,
    },
    about: { type: String, default: "Hey there fellow FASTIANS!" },
  },
  { timestamps: true }
);

// Static method to fetch user's friends names and their profile pictures (pfp)
userSchema.statics.getUserFriends = async function (userId) {
  try {
    const user = await this.findById(userId).populate("friends", "name pfp");
    return user
      ? user.friends.map(({ name, pfp }) => ({
          name,
          pfp: pfp || "/images/userpfp.png",
        }))
      : [];
  } catch (error) {
    console.error("Error fetching user friends:", error);
    return [];
  }
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
