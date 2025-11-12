import express from "express";
import isAuthenticated from "../middlewares/auth.js";
import {
  appliedJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, appliedJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicant").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
