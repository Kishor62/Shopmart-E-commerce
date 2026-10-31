import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken, COOKIE_NAME } from "../utils/token.js";

function extractToken(req) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.[COOKIE_NAME];
}

// Requires a valid login
export async function protect(req, _res, next) {
  const token = extractToken(req);
  if (!token) throw new AppError("Please login to continue", 401);

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError("Session expired, please login again", 401);
  }

  const user = await User.findById(payload.id);
  if (!user) throw new AppError("User no longer exists", 401);

  req.user = user;
  next();
}

export const restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You do not have permission to do this", 403);
    }
    next();
  };
