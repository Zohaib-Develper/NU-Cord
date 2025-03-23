const mongoose = require("mongoose");
const { Schema } = mongoose;

const channelSchema = new Schema(
  {
    owner_server: [{ type: Schema.Types.ObjectId, ref: "Server" }],
    name: { type: String, required: true },
    coverImageURL: { type: String, default: "/images/batchpfp.png" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);
