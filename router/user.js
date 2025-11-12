import express from "express";
import { login, logout, register, updateProfie } from "../controllers/user.js";
import isAuthenticated from "../middlewares/auth.js";
import { getCompany, registerCompany } from "../controllers/company.js";
import { singleupload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleupload, register);
router.route("/login").post(login);
router.route("/update").post(singleupload, isAuthenticated, updateProfie);
router.route("/logout").get(logout);
router.route("/company/register").post(isAuthenticated, registerCompany);
router.route("/company/get").get(isAuthenticated, getCompany);

export default router;
