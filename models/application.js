import mongoose from "mongoose";

const ApplicatonSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "job" },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("application", ApplicatonSchema);
