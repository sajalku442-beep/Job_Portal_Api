import express from "express";

import isAuthenticated from "../middlewares/auth.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompanyInfo,
} from "../controllers/company.js";
import { singleupload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(getCompanyById);
router
  .route("/update/:id")
  .put(singleupload, isAuthenticated, updateCompanyInfo);

export default router;
