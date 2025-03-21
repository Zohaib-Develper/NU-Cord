const mongoose = require("mongoose");
const { Schema } = mongoose;

const serverSchema = new Schema(
  {
    serverID: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], 
    coverImageURL: { type: String, default: "/images/batchpfp.png" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Server", serverSchema);
