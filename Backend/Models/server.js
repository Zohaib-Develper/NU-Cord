const mongoose = require("mongoose");
const { Schema } = mongoose;

const serverSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    joining_requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    coverImageURL: { type: String, default: "/images/batchpfp.png" },
    channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

// Static method to fetch servers names and their cover images
serverSchema.statics.getServerNames = async function (serverIds) {
  try {
    const servers = await this.find(
      { _id: { $in: serverIds } },
      "name coverImgURL"
    );
    return servers.map(({ _id, name, coverImageURL }) => ({
      name,
      coverImgURL: coverImageURL || "/images/batchpfp.png",
    }));
  } catch (error) {
    console.error("Error fetching server names:", error);
    return [];
  }
};

module.exports =
  mongoose.models.Server || mongoose.model("Server", serverSchema);
