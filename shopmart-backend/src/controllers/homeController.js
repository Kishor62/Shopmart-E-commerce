import { HomeItem } from "../models/HomeItem.js";
import { AppError } from "../utils/AppError.js";

// ---------- Public ----------
// GET /api/home-content -> { slides: [...], cards: [...] }
// Only active items whose schedule window (startAt/endAt) includes "now".
export async function getHomeContent(_req, res) {
  const now = new Date();
  const items = await HomeItem.find({
    isActive: true,
    $and: [
      { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
      { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
    ],
  }).sort({ order: 1, createdAt: -1 });

  res.set("Cache-Control", "public, max-age=60"); // small cache, banners are not time critical
  res.json({
    success: true,
    slides: items.filter((i) => i.kind === "slide"),
    cards: items.filter((i) => i.kind === "card"),
  });
}

// ---------- Admin ----------
// GET /api/admin/home-items?kind=slide|card  (includes inactive + scheduled ones)
export async function adminList(req, res) {
  const filter = {};
  if (["slide", "card"].includes(req.query.kind)) filter.kind = req.query.kind;
  const items = await HomeItem.find(filter).sort({ kind: 1, order: 1, createdAt: -1 });
  res.json({ success: true, items });
}

export async function adminCreate(req, res) {
  const item = await HomeItem.create(req.body);
  res.status(201).json({ success: true, item });
}

export async function adminUpdate(req, res) {
  const item = await HomeItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new AppError("Item not found", 404);
  res.json({ success: true, item });
}

export async function adminDelete(req, res) {
  const item = await HomeItem.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError("Item not found", 404);
  res.json({ success: true, message: "Deleted" });
}
