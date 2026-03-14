import nodemailer from "nodemailer";
import { ENV } from "./env.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: ENV.EMAIL_SMTP_HOST || "smtp.gmail.com",
    port: parseInt(ENV.EMAIL_SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: ENV.EMAIL_SMTP_USER,
      pass: ENV.EMAIL_SMTP_PASS,
    },
  });
};

const emailTemplate = (title, content, buttonText, buttonUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1d2e;border-radius:16px;overflow:hidden;border:1px solid #2d3748;">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">⚡ CodeInterview</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px;">
              <div style="color:#e2e8f0;font-size:15px;line-height:1.7;">
                ${content}
              </div>
              ${buttonText && buttonUrl ? `
              <div style="text-align:center;margin:32px 0 0;">
                <a href="${buttonUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">${buttonText}</a>
              </div>
              ` : ""}
              <p style="margin:24px 0 0;color:#718096;font-size:12px;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#13151f;padding:20px 32px;text-align:center;border-top:1px solid #2d3748;">
              <p style="margin:0;color:#4a5568;font-size:12px;">© 2024 CodeInterview. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendVerificationEmail = async (user, token) => {
  try {
    const transporter = createTransporter();
    const verifyUrl = `${ENV.CLIENT_URL}/verify-email/${token}`;
    const content = `
      <p>Hi <strong style="color:#a78bfa;">${user.name}</strong>,</p>
      <p>Welcome to CodeInterview! Please verify your email address to activate your account and start practicing.</p>
      <p>This link will expire in <strong>24 hours</strong>.</p>
    `;
    await transporter.sendMail({
      from: `"CodeInterview" <${ENV.EMAIL_FROM || ENV.EMAIL_SMTP_USER}>`,
      to: user.email,
      subject: "Verify your CodeInterview account",
      html: emailTemplate("Email Verification", content, "Verify Email Address", verifyUrl),
    });
    console.log(`✅ Verification email sent to ${user.email}`);
  } catch (err) {
    console.error("❌ Error sending verification email:", err.message);
  }
};

export const sendPasswordResetEmail = async (user, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${ENV.CLIENT_URL}/reset-password/${token}`;
    const content = `
      <p>Hi <strong style="color:#a78bfa;">${user.name}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to set a new password.</p>
      <p>This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email.</p>
    `;
    await transporter.sendMail({
      from: `"CodeInterview" <${ENV.EMAIL_FROM || ENV.EMAIL_SMTP_USER}>`,
      to: user.email,
      subject: "Reset your CodeInterview password",
      html: emailTemplate("Password Reset", content, "Reset Password", resetUrl),
    });
    console.log(`✅ Password reset email sent to ${user.email}`);
  } catch (err) {
    console.error("❌ Error sending reset email:", err.message);
  }
};
