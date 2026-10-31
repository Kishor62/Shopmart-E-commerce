import rateLimit from "express-rate-limit";

const json = (message) => ({ success: false, message });

// Global limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many requests, please try again later"),
});

// Stricter limiter for login/register (brute-force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many attempts, please try again in 15 minutes"),
});
