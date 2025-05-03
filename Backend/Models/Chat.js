const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    // Only one of the following can contain value for a single object of chat
    channel: { type: Schema.Types.ObjectId, ref: "Channel" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    deleteFromMe: { type: Boolean, default: false },
    deleteFromEveryone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
