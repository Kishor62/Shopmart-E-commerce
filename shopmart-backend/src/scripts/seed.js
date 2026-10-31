// Usage:  npm run seed          -> wipe & insert sample data + admin user
//         npm run seed:destroy  -> wipe products/categories/orders
import fs from "node:fs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { HomeItem } from "../models/HomeItem.js";

const categories = [
  { name: "Mobiles", slug: "mobiles", icon: "📱" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Electronics", slug: "electronics", icon: "🎧" },
  { name: "Appliances", slug: "appliances", icon: "🧺" },
  { name: "Smart Gadgets", slug: "smart-gadgets", icon: "⌚" },
  { name: "Home", slug: "home", icon: "🍳" },
  { name: "Beauty", slug: "beauty", icon: "💄" },
  { name: "Grocery", slug: "grocery", icon: "🥦" },
];

// [title, brand, category, price, discount%, stock, rating]
const rows = [
  ["Nova X1 5G 128GB", "Nova", "mobiles", 18999, 12, 40, 4.4],
  ["Nova X1 Pro 256GB", "Nova", "mobiles", 27999, 8, 25, 4.6],
  ["Pixel Lite 6 128GB", "Pixa", "mobiles", 14999, 15, 60, 4.2],
  ["Aero Fold 5G 512GB", "Aero", "mobiles", 79999, 5, 10, 4.7],
  ["Classic Cotton Shirt", "UrbanWear", "fashion", 1299, 40, 120, 4.1],
  ["Slim Fit Denim Jeans", "UrbanWear", "fashion", 1999, 35, 90, 4.3],
  ["Floral Summer Kurti", "Ethnica", "fashion", 999, 30, 150, 4.0],
  ["Running Shoes Flex", "Stride", "fashion", 2499, 25, 70, 4.5],
  ["Leather Backpack 25L", "Carryall", "fashion", 2199, 20, 45, 4.2],
  ["Wireless Earbuds Pro", "Soniq", "electronics", 3499, 30, 100, 4.4],
  ["Bluetooth Speaker 20W", "Soniq", "electronics", 2999, 25, 80, 4.3],
  ["10000mAh Powerbank", "ChargeUp", "electronics", 1199, 20, 200, 4.2],
  ["27in 4K Monitor", "Visio", "electronics", 21999, 10, 20, 4.5],
  ["Front Load Washer 7kg", "CleanPro", "appliances", 31999, 14, 12, 4.4],
  ["Smart LED TV 43in", "Visio", "appliances", 24999, 18, 18, 4.5],
  ["Air Fryer 4.2L", "CrispyCo", "appliances", 5499, 28, 55, 4.3],
  ["Smartwatch Active 2", "Pulse", "smart-gadgets", 3999, 35, 75, 4.2],
  ["Fitness Band Lite", "Pulse", "smart-gadgets", 1799, 30, 110, 4.0],
  ["Smart Bulb 9W (2 pack)", "Lumo", "smart-gadgets", 899, 20, 300, 4.1],
  ["Pressure Cooker 5L", "KitchenKing", "home", 1899, 22, 65, 4.4],
  ["Cotton Bedsheet King", "SnugHome", "home", 1499, 38, 85, 4.2],
  ["Vitamin C Face Serum", "Glowly", "beauty", 599, 25, 140, 4.3],
  ["Perfume Spray 100ml", "Aurelia", "beauty", 1299, 30, 90, 4.1],
  ["Basmati Rice 5kg", "FarmFresh", "grocery", 649, 10, 250, 4.5],
  ["Cold Pressed Mustard Oil 1L", "FarmFresh", "grocery", 189, 8, 400, 4.4],
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const products = rows.map(([title, brand, category, price, discountPercentage, stock, rating]) => {
  const img = (n) =>
    `https://placehold.co/600x600/eef2ff/4f46e5?text=${encodeURIComponent(title)}${n ? `+${n}` : ""}`;
  return {
    title,
    brand,
    category,
    price,
    discountPercentage,
    stock,
    rating,
    ratingCount: Math.floor(rating * 120),
    description: `${title} by ${brand}. Great quality, fast delivery and easy returns.`,
    thumbnail: img(),
    images: [img(), img(2), img(3)],
    tags: [category, brand.toLowerCase(), ...slugify(title).split("-").slice(0, 2)],
  };
});

async function run() {
  await connectDB();

  await Promise.all([
    Category.deleteMany(),
    Product.deleteMany(),
    Order.deleteMany(),
    HomeItem.deleteMany(),
  ]);
  console.log("🗑️  Cleared categories, products, orders");

  if (process.argv.includes("--destroy")) return;

  // Prefer data/products.json (100 products) if present, else the small built-in sample
  const dataFile = new URL("../../data/products.json", import.meta.url);
  const toInsert = fs.existsSync(dataFile)
    ? JSON.parse(fs.readFileSync(dataFile, "utf8"))
    : products;

  await Category.insertMany(categories);
  await Product.insertMany(toInsert);
  console.log(`🌱 Inserted ${categories.length} categories and ${toInsert.length} products`);

  // Sample banner slides + cards (admin can change all of these from the dashboard)
  const ph = (text, bg = "4f46e5") =>
    `https://placehold.co/1200x500/${bg}/ffffff?text=${encodeURIComponent(text)}`;
  const card = (text) => `https://placehold.co/400x400/eef2ff/4f46e5?text=${encodeURIComponent(text)}`;
  await HomeItem.insertMany([
    { kind: "slide", title: "Diwali Dhamaka Sale", subtitle: "Up to 50% off", image: ph("Diwali Dhamaka Sale", "ea580c"), link: "/products?tag=diwali", order: 1 },
    { kind: "slide", title: "New Launches", subtitle: "Fresh arrivals this week", image: ph("New Launches", "4f46e5"), link: "/products", order: 2 },
    { kind: "slide", title: "Free delivery above ₹499", image: ph("Free Delivery above 499", "059669"), link: "/products", order: 3 },
    { kind: "card", title: "Diwali Sale", badge: "Live now", image: card("Diwali"), link: "/products?tag=diwali", order: 1 },
    { kind: "card", title: "New Arrivals", badge: "New", image: card("New"), link: "/products", order: 2 },
    { kind: "card", title: "Under ₹999", image: card("Under 999"), link: "/products?maxPrice=999", order: 3 },
    { kind: "card", title: "Grocery", image: card("Grocery"), link: "/products?category=grocery", order: 4 },
  ]);
  console.log("🖼️  Inserted sample home banners and cards");

  const adminEmail = "admin@shopmart.com";
  if (!(await User.exists({ email: adminEmail }))) {
    await User.create({
      name: "Shopmart Admin",
      email: adminEmail,
      password: "Admin@1234",
      role: "admin",
    });
    console.log(`👤 Admin created: ${adminEmail} / Admin@1234  (change this password!)`);
  }
}

run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
