import { env } from "@/env.mjs";
import cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: env.CLOUDINARY_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET
})


export default cloudinary;