const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const majorSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    academicDegree: { type: Schema.Types.ObjectId, ref: "AcademicDegree", required: true }, 
  },
  { timestamps: true }
);


module.exports = mongoose.model("Major", majorSchema);
