const mongoose = require("mongoose");
const { Schema } = mongoose;

const campusSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, enum: ["ISB", "KHI", "LHR", "PSH", "CFD"] },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campus", campusSchema);
