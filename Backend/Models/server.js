const mongoose = require("mongoose");
const { Schema } = mongoose;

const serverSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    joining_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    coverImageURL: { type: String, default: "/images/batchpfp.png" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Server", serverSchema);
