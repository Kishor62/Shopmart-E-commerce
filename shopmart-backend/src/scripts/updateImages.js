// Replaces the placeholder product images with real product photos (from DummyJSON's free image CDN).
//
// Usage (inside shopmart-backend):   npm run images
// - Only touches thumbnail + images of existing products. Prices, stock, orders, users are NOT changed.
// - Safe to run more than once.
//
// NOTE: these are demo photos matched by product type (a "Wireless Mouse" gets some accessory photo,
// not that exact mouse). For your own real products, upload your own photos (Cloudinary etc.)
// and save their URLs in thumbnail / images.
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";

const SOURCE = "https://dummyjson.com/products?limit=0&select=title,category,thumbnail,images";

// First matching rule wins: product title -> DummyJSON photo categories to borrow from
const RULES = [
  [/sunglass/i, ["sunglasses"]],
  [/\brice\b|\batta\b|\boil\b|dry fruit|\btea\b|peanut|\boats\b|honey/i, ["groceries"]], // before "bag" (Tea Bags)
  [/\bwatch\b|smartwatch|fitness band/i, ["mens-watches", "womens-watches"]], // not brand "WatchEye"
  [/shoe|sneaker/i, ["mens-shoes", "womens-shoes"]],
  [/kurti|\bdress\b/i, ["womens-dresses", "tops"]],
  [/shirt|hood|sweat|jeans/i, ["mens-shirts"]],
  [/backpack|\bbags?\b/i, ["womens-bags"]],
  [/serum|aloe|sunscreen|shampoo/i, ["skin-care"]],
  [/perfume/i, ["fragrances"]],
  [/lipstick|trimmer|dryer/i, ["beauty"]],
  [/bottle|\bpan\b|cooker|dinner|kettle|mixer|blender|sandwich|cooktop|\biron\b/i, ["kitchen-accessories"]],
  [/bedsheet|towel|organizer|clock|\bmat\b|lights|lamp|bulb|\bfan\b|heater/i, ["home-decoration", "furniture"]],
  [/cable|charger|\bcase\b|screen|stand|mount|power ?bank|selfie|earphone|earbud|neckband|speaker|tracker|plug|pen ?drive|mouse|keyboard/i, ["mobile-accessories"]],
  [/monitor|cooling|projector|camera/i, ["laptops", "tablets"]],
];

// If no title rule matches, fall back to our shop category
const CATEGORY_FALLBACK = {
  mobiles: ["mobile-accessories", "smartphones"],
  fashion: ["mens-shirts", "womens-dresses", "mens-shoes"],
  electronics: ["laptops", "tablets", "mobile-accessories"],
  appliances: ["kitchen-accessories"],
  "smart-gadgets": ["mens-watches", "womens-watches"],
  home: ["home-decoration", "furniture", "kitchen-accessories"],
  beauty: ["beauty", "skin-care", "fragrances"],
  grocery: ["groceries"],
};

export function pickSourceCategories(title, shopCategory) {
  for (const [rx, cats] of RULES) if (rx.test(title)) return cats;
  return CATEGORY_FALLBACK[shopCategory] ?? ["smartphones"];
}

// Builds { thumbnail, images[] } for each product, cycling through the photo pool so neighbours differ
export function assignImages(products, source) {
  const pools = new Map();
  for (const s of source) {
    if (!pools.has(s.category)) pools.set(s.category, []);
    pools.get(s.category).push(s);
  }

  const counters = new Map();
  const updates = [];
  for (const p of products) {
    const cats = pickSourceCategories(p.title, p.category);
    const pool = cats.flatMap((c) => pools.get(c) ?? []);
    if (!pool.length) continue;

    const key = cats.join("|");
    const i = counters.get(key) ?? 0;
    counters.set(key, i + 1);

    const pick = pool[i % pool.length];
    const images = [pick.thumbnail, ...(pick.images ?? [])].filter(Boolean);
    updates.push({ id: p._id, thumbnail: pick.thumbnail, images: [...new Set(images)].slice(0, 4) });
  }
  return updates;
}

async function run() {
  console.log("⬇️  Downloading photo list from DummyJSON...");
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`DummyJSON returned ${res.status}`);
  const { products: source } = await res.json();
  console.log(`   got ${source.length} photos`);

  await connectDB();
  const products = await Product.find().select("title category");
  const updates = assignImages(products, source);

  if (updates.length) {
    await Product.bulkWrite(
      updates.map((u) => ({
        updateOne: { filter: { _id: u.id }, update: { $set: { thumbnail: u.thumbnail, images: u.images } } },
      }))
    );
  }
  console.log(`🖼️  Updated images for ${updates.length} of ${products.length} products`);
}

// Run only when executed directly (lets the tests import the helpers)
if (import.meta.url === new URL(process.argv[1], "file://").href || process.argv[1]?.endsWith("updateImages.js")) {
  run()
    .catch((e) => {
      console.error("❌", e.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}