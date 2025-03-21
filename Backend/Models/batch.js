const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema(
  {
    year: { type: Number, required: true },
    campus: { type: Schema.Types.ObjectId, ref: "Campus", required: true },
    academicDegrees: [{ type: Schema.Types.ObjectId, ref: "AcademicDegree" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema);
