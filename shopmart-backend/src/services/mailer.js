import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

let transporter;

const isConfigured = () => Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

function getTransporter() {
  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

export async function sendOtpEmail(to, otp) {
  if (!isConfigured()) {
    if (env.isProd) throw new AppError("Email service is not configured", 503);
    // Development convenience: no SMTP needed, read the OTP from this console
    console.log(`\n📧 [DEV ONLY] Password reset OTP for ${to}: ${otp}\n`);
    return;
  }

  await getTransporter().sendMail({
    from: env.MAIL_FROM,
    to,
    subject: "Your Shopmart password reset OTP",
    text: `Your Shopmart OTP is ${otp}. It is valid for 10 minutes. If you did not ask for this, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
        <h2 style="margin:0 0 8px;color:#0f172a">Shopmart password reset</h2>
        <p style="color:#475569">Use this OTP to reset your password:</p>
        <p style="font-size:32px;font-weight:800;letter-spacing:8px;margin:16px 0;color:#4f46e5">${otp}</p>
        <p style="color:#64748b;font-size:13px">Valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
      </div>`,
  });
}
