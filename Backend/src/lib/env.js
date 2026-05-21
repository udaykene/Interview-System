import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Backend/.env reliably no matter where the Node process was started from.
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  quiet: true,
});

export const ENV = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || "interview-system/profile-images",

  STREAM_API_KEY:process.env.STREAM_API_KEY,
  STREAM_API_SECRET:process.env.STREAM_API_SECRET,

  SESSION_SECRET: process.env.SESSION_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  SERVER_URL: process.env.SERVER_URL || "http://localhost:3000",
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || "udaykene96@gmail.com",
  EMAIL_FROM: process.env.EMAIL_FROM,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  PISTON_API: process.env.PISTON_API || "https://emkc.org/api/v2/piston",
  PISTON_API_KEY: process.env.PISTON_API_KEY,
};
