import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

const sendAuth = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    token: generateToken(user._id),
    user,
  });
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email aur password zaroori hain");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, "Is email se account pehle se hai");

  // role hamesha "user" rahega; admin sirf seed script se banta hai
  const user = await User.create({ name, email, password, phone });
  sendAuth(res, user, 201);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email aur password daalo");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Email ya password galat hai");
  }

  sendAuth(res, user);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address, password } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address) user.address = { ...user.address?.toObject?.(), ...address };
  if (password) {
    if (password.length < 6) throw new ApiError(400, "Password kam se kam 6 characters ka ho");
    user.password = password;
  }

  await user.save();
  res.json({ success: true, user });
});

// POST /api/auth/forgot-password
// Email service abhi nahi hai, isliye development mein token response mein milta hai
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email daalo");

  const user = await User.findOne({ email: email.toLowerCase() });
  const message = "Agar ye email registered hai to reset link bhej diya gaya hai";

  if (!user) return res.json({ success: true, message });

  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: yahan email (Nodemailer/Resend) se link bhejo:
  // `${process.env.CLIENT_URL}/reset-password/${token}`
  res.json({
    success: true,
    message,
    ...(process.env.NODE_ENV !== "production" && { resetToken: token }),
  });
});

// POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    throw new ApiError(400, "Naya password kam se kam 6 characters ka ho");
  }

  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpire");

  if (!user) throw new ApiError(400, "Reset token invalid ya expire ho gaya hai");

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendAuth(res, user);
});
