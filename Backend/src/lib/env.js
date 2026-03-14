import dotenv from "dotenv";
dotenv.config({ quiet: true }); //Stop the .env warning in the terminal

export const ENV = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,

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
  EMAIL_FROM: process.env.EMAIL_FROM || "interviewsys@gmail.com",
  EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
  EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT || "587",
  EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || "interviewsys@gmail.com",
  EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS || "paeeidcfxhtoxchq",
};
