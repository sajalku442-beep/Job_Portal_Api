import express from "express";

import isAuthenticated from "../middlewares/auth.js";
import {
  getAdminJob,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getAdmin").get(isAuthenticated, getAdminJob);
router.route("/get/:id").get(isAuthenticated, getJobById);
export default router;
