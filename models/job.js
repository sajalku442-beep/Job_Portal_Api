import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  salary: { type: String, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  position: { type: Number, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    require: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  application: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "application",
    },
  ],
});

export const Job = mongoose.model("job", JobSchema);
