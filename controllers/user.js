import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.json({
        message: "Something is missing",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    console.log(cloudResponse);

    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        message: "User Already existed",
        success: false,
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      phone,
      password: hashpassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });
    return res.json({
      message: "User registed sucessfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.json({
        message: "Enter All field",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "User doesnot exist",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.json({
        message: "Wrong Password",
        success: false,
      });
    }
    if (role !== user.role) {
      return res.json({
        message: "Account doesnot exist with current role",
        success: false,
      });
    }
    const tokendata = {
      userId: user._id,
    };
    const token = await jwt.sign(tokendata, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile,
    };

    return res
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: `welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" })
      .json({
        message: "Log Out succesfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfie = async (req, res) => {
  try {
    const { name, email, phone, bio, skills } = req.body;
    const file = req.file;

    let cloudResponse;

    if (file) {
      const fileUri = getDataUri(file);
      const cloud = await cloudinary.uploader.upload(fileUri.content);
      cloudResponse = cloud;
    }

    console.log(cloudResponse);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id;
    let user = await User.findById(userId);

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile,
    };

    res.json({
      message: "Updated sucessfulluy",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
