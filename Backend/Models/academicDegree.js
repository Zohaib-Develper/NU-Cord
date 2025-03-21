const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academicDegreeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["BS", "MS", "PhD"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicDegree", academicDegreeSchema);
