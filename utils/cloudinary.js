import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary;
// cloud_name: "dag4wmjom",
//   api_key: "683578853798351",
//   api_secret: "cY2XFIYdlalRkOQG0yJ5z_rELdU",
