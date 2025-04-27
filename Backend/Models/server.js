const mongoose = require("mongoose");
const { Schema } = mongoose;

const serverSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    joining_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

// Static method to fetch servers names
serverSchema.statics.getServerNames = async function (serverIds) {
  try {
    const servers = await this.find(
      { _id: { $in: serverIds } },
      "name"
    );
    return servers.map(({ _id, name }) => ({
      name,
    }));
  } catch (error) {
    console.error("Error fetching server names:", error);
    return [];
  }
};

module.exports =
  mongoose.models.Server || mongoose.model("Server", serverSchema);
