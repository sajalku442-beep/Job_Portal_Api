import { populate } from "dotenv";
import { Application } from "../models/application.js";
import { Job } from "../models/job.js";

export const appliedJob = async (req, res) => {
  try {
    const userId = req.id;

    const jobId = req.params.id;
    if (!jobId) {
      return res.json({
        message: "Job Id requires",
        success: false,
      });
    }
    //if if aleady applied for job

    const existiingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existiingApplication) {
      return res.json({
        message: "You Had Already Applied To the job",
        success: false,
      });
    }

    //check if the job exist

    const job = await Job.findById(jobId);
    if (!job) {
      return res.json({
        message: "Job does not exist",
        success: false,
      });
    }

    //create new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.application.push(newApplication._id);
    await job.save();
    return res.json({
      message: "Job saved sucessfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!application) {
      res.json({
        message: "You havot applied to any job",
        success: false,
      });
    }
    return res.json({
      message: "All applied job",
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "application",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.json({
        message: "Job deos not exist",
        success: false,
      });
    }
    return res.json({
      message: "Getting all applicants",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const applicationId = req.params.id;

    if (!status) {
      res.json({
        message: "Status required",
        success: false,
      });
    }
    //find application by application id

    const application = await Application.findOne({ _id: applicationId });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    //Update status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
