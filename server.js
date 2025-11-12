import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";


import userRouter from "./router/user.js";
import companyRouter from "./router/company.js";
import jobRouter from "./router/job.js";
import applicationRouter from "./router/application.js";
import axios from "axios";
dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.json({
    message: "I am comming from backend",
    success: true,
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("MongoDb connected successfully"))
  .catch((error) => console.log(error.message));

app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is running at port ${port}`));
