import { Company } from "../models/company.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);

    if (!name) {
      return res.json({
        messsage: "Company name is requireed",
        success: false,
      });
    }
    let company = await Company.findOne({ name });
    if (company) {
      return res.json({
        message: "You cannot register same company",
        success: false,
      });
    }
    company = await Company.create({
      name: name,
      userId: req.id,
    });

    return res.json({
      message: "Company registered sucessfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged in user's id
    console.log(userId);

    const company = await Company.find({ userId });
    if (!company) {
      return res.json({
        message: "Company not found",
        success: false,
      });
    }
    return res.json({
      message: "Company found",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({
        message: "Company not found",
        success: true,
      });
    }
    return res.json({
      message: "Company Founded",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompanyInfo = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    //cloudinary
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const updateData = { name, description, website, location, logo };
    // console.log(req.params.id);

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    //  console.log(company);

    if (!company) {
      return res.json({
        message: "Company not found",
        success: false,
      });
    }
    return res.json({
      message: "Company data Updated SucssFully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
