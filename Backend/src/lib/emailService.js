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
    tls: {
      rejectUnauthorized: false,
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
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#060814;font-family:'Outfit',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#060814;padding:40px 0;width:100%;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#0c0f1d;border-radius:20px;overflow:hidden;border:1px solid #1e2238;box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);width:560px;max-width:100%;">
          <!-- Top Gradient Border -->
          <tr>
            <td height="6" style="background:linear-gradient(90deg, #6366f1, #a855f7, #06b6d4);line-height:6px;font-size:0;">&nbsp;</td>
          </tr>
          <!-- Header / Brand Section -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:rgba(99, 102, 241, 0.1);border:1px solid rgba(99, 102, 241, 0.2);padding:10px 20px;border-radius:30px;">
                      <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;vertical-align:middle;display:inline-block;">⚡ <span style="background:linear-gradient(135deg, #a5b4fc, #818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#818cf8;">CodeInterview</span></span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;">
                    <h2 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">${title}</h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content Section -->
          <tr>
            <td style="padding:20px 40px 40px;">
              <div style="color:#cbd5e1;font-size:15px;line-height:1.8;font-weight:400;margin-bottom:30px;">
                ${content}
              </div>
              
              <!-- CTA Button Section -->
              ${buttonText && buttonUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:35px 0 25px;">
                <tr>
                  <td align="center">
                    <a href="${buttonUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:15px 38px;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.5px;box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);text-align:center;">${buttonText}</a>
                  </td>
                </tr>
              </table>
              
              <!-- Plain Link Fallback -->
              <div style="background:rgba(30, 41, 59, 0.5);border:1px solid #1e293b;border-radius:10px;padding:15px;margin-top:30px;word-break:break-all;text-align:center;">
                <p style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Or copy & paste this URL into your browser:</p>
                <a href="${buttonUrl}" style="color:#38bdf8;font-size:13px;text-decoration:none;font-family:monospace;word-wrap:break-word;">${buttonUrl}</a>
              </div>
              ` : ""}

              <!-- Security Divider & Alert -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:35px;border-top:1px solid #1e2238;padding-top:25px;">
                <tr>
                  <td style="color:#64748b;font-size:12px;line-height:1.6;text-align:center;">
                    <span style="display:inline-block;vertical-align:middle;margin-right:4px;">🔒</span> <strong>Security Note:</strong> CodeInterview will never ask for your password via email. If you did not initiate this request, you can safely ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer Section -->
          <tr>
            <td style="background-color:#070914;padding:30px 40px;text-align:center;border-top:1px solid #1e2238;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:15px;">
                    <!-- Minimalist Brand Footer link -->
                    <a href="${ENV.CLIENT_URL}" style="color:#64748b;font-size:12px;text-decoration:none;font-weight:500;margin:0 10px;">Platform</a>
                    <span style="color:#334155;font-size:12px;">•</span>
                    <a href="${ENV.CLIENT_URL}/support" style="color:#64748b;font-size:12px;text-decoration:none;font-weight:500;margin:0 10px;">Support</a>
                    <span style="color:#334155;font-size:12px;">•</span>
                    <a href="${ENV.CLIENT_URL}/privacy" style="color:#64748b;font-size:12px;text-decoration:none;font-weight:500;margin:0 10px;">Privacy Policy</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;color:#475569;font-size:11px;letter-spacing:0.2px;">© ${new Date().getFullYear()} CodeInterview. All rights reserved.</p>
                  </td>
                </tr>
              </table>
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
      <p style="margin:0 0 16px;">Hi <strong style="color:#a5b4fc;font-weight:600;">${user.name}</strong>,</p>
      <p style="margin:0 0 16px;color:#cbd5e1;">Welcome to <strong style="color:#ffffff;">CodeInterview</strong>! We're excited to have you join our community of developers practicing and mastering technical interviews.</p>
      <p style="margin:0 0 24px;color:#cbd5e1;">Please verify your email address to activate your account and start practicing. This link is secure and will expire in <strong style="color:#f87171;">24 hours</strong>.</p>
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
      <p style="margin:0 0 16px;">Hi <strong style="color:#a5b4fc;font-weight:600;">${user.name}</strong>,</p>
      <p style="margin:0 0 16px;color:#cbd5e1;">We received a request to reset your password for your <strong style="color:#ffffff;">CodeInterview</strong> account.</p>
      <p style="margin:0 0 24px;color:#cbd5e1;">Click the button below to set a new password. For security reasons, this link will expire in <strong style="color:#f87171;">1 hour</strong>. If you did not make this request, you can safely ignore this email.</p>
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
