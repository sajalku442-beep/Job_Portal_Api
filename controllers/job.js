import { Job } from "../models/job.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      experience,
      companyId,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !experience ||
      !companyId
    ) {
      return res.json({
        message: "something is wrong",
        success: false,
      });
    }
    const userId = req.id;
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary,
      location,
      jobType,
      position,
      experience: experience,
      company: companyId,
      created_by: userId,
    });
    return res.json({
      message: "New job created sucessfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    console.log("keyword from back end", keyword);

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .populate({
        path: "application",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.json({
        message: "job not found",
        success: false,
      });
    }
    // console.log(jobs);
    return res.json({
      message: "all Job",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({
        path: "application",
      })
      .populate({
        path: "company",
      });
    if (!job) {
      return res.json({
        message: "job not found",
        success: false,
      });
    }
    return res.json({
      message: "Job By Id",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
//admin
export const getAdminJob = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate({
        path: "company",
      })
      .populate({
        path: "application",
      });
    if (!jobs) {
      return res.json({
        message: "job not found",
        success: false,
      });
    }
    return res.json({
      message: "Job By Admin Id",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
