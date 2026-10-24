import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// Login zaroori hai
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Login karo, token nahi mila");
  }

  let decoded;
  try {
    decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Token invalid ya expire ho gaya hai");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "User ab exist nahi karta");

  req.user = user;
  next();
});

// Sirf admin
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Sirf admin ye kaam kar sakta hai");
  }
  next();
};
