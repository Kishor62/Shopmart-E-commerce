import crypto from "node:crypto";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { sendOtpEmail } from "../services/mailer.js";

const OTP_TTL_MS = 10 * 60 * 1000; // OTP valid for 10 minutes
const RESET_TTL_MS = 15 * 60 * 1000; // after OTP is verified, user has 15 minutes to set the password
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

// OTP / token are never stored in plain text
const hash = (value) =>
  crypto.createHmac("sha256", env.JWT_SECRET).update(String(value)).digest("hex");

const safeEqual = (a = "", b = "") => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

const GENERIC = {
  success: true,
  message: "If this email is registered, an OTP has been sent to it.",
};

// Step 1: POST /api/auth/forgot-password { email }
// Same response whether or not the email exists, so nobody can discover registered emails.
export async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email }).select("+passwordReset");

  if (user) {
    const last = user.passwordReset?.lastSentAt?.getTime() ?? 0;
    if (Date.now() - last >= RESEND_COOLDOWN_MS) {
      const otp = String(crypto.randomInt(100000, 1000000)); // 6 digits, cryptographically random
      user.passwordReset = {
        otpHash: hash(otp),
        otpExpires: new Date(Date.now() + OTP_TTL_MS),
        attempts: 0,
        lastSentAt: new Date(),
      };
      await user.save();
      await sendOtpEmail(user.email, otp);
    }
  }

  res.json(GENERIC);
}

// Step 2: POST /api/auth/verify-otp { email, otp }  ->  { resetToken }
export async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  const invalid = () => new AppError("Invalid or expired OTP", 400);

  const user = await User.findOne({ email }).select("+passwordReset");
  const pr = user?.passwordReset;
  if (!pr?.otpHash || !pr.otpExpires || pr.otpExpires < new Date()) throw invalid();

  if ((pr.attempts ?? 0) >= MAX_ATTEMPTS) {
    user.passwordReset = undefined; // burn the OTP, user must request a new one
    await user.save();
    throw new AppError("Too many wrong attempts. Please request a new OTP.", 429);
  }

  if (!safeEqual(hash(otp), pr.otpHash)) {
    await User.updateOne({ _id: user._id }, { $inc: { "passwordReset.attempts": 1 } });
    throw invalid();
  }

  // OTP correct: swap it for a short lived reset token (OTP can't be reused)
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordReset = {
    resetTokenHash: hash(resetToken),
    resetTokenExpires: new Date(Date.now() + RESET_TTL_MS),
    attempts: 0,
  };
  await user.save();

  res.json({ success: true, resetToken });
}

// Step 3: POST /api/auth/reset-password { email, resetToken, newPassword }
export async function resetPassword(req, res) {
  const { email, resetToken, newPassword } = req.body;
  const expired = () => new AppError("Reset session expired. Please start again.", 400);

  const user = await User.findOne({ email }).select("+passwordReset");
  const pr = user?.passwordReset;
  if (
    !pr?.resetTokenHash ||
    !pr.resetTokenExpires ||
    pr.resetTokenExpires < new Date() ||
    !safeEqual(hash(resetToken), pr.resetTokenHash)
  ) {
    throw expired();
  }

  user.password = newPassword; // hashed by the model's pre-save hook
  user.passwordReset = undefined;
  await user.save();

  res.json({ success: true, message: "Password changed successfully. Please login." });
}
