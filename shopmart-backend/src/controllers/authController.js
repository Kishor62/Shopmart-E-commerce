import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";

function sendAuth(res, user, status = 200) {
  const token = signToken(user._id);
  setAuthCookie(res, token);
  res.status(status).json({ success: true, token, user });
}

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  if (await User.exists({ email })) throw new AppError("Email already registered", 409);
  const user = await User.create({ name, email, password, phone }); // role is never taken from client
  sendAuth(res, user, 201);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  sendAuth(res, user);
}

export function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logged out" });
}

export function me(req, res) {
  res.json({ success: true, user: req.user });
}

export async function updateMe(req, res) {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json({ success: true, user: req.user });
}

export async function changePassword(req, res) {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new AppError("Current password is incorrect", 400);
  }
  user.password = req.body.newPassword;
  await user.save();
  sendAuth(res, user);
}

// ---------- Saved addresses ----------
export async function addAddress(req, res) {
  req.user.addresses.push(req.body);
  await req.user.save();
  res.status(201).json({ success: true, addresses: req.user.addresses });
}

export async function deleteAddress(req, res) {
  req.user.addresses.pull({ _id: req.params.id });
  await req.user.save();
  res.json({ success: true, addresses: req.user.addresses });
}
