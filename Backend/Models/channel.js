const mongoose = require("mongoose");
const { Schema } = mongoose;

const channelSchema = new Schema(
  {
    owner_server: [{ type: Schema.Types.ObjectId, ref: "Server" }],
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Channel || mongoose.model("Channel", channelSchema);
