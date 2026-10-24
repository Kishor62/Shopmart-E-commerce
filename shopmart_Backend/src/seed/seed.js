import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import products from "./products.js";

const run = async () => {
  await connectDB();

  if (process.argv.includes("--destroy")) {
    await Promise.all([Order.deleteMany(), Product.deleteMany(), User.deleteMany()]);
    console.log("Saara data delete ho gaya");
  } else {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`${products.length} products add hue`);

    const email = (process.env.ADMIN_EMAIL || "admin@shopmart.com").toLowerCase();
    const exists = await User.findOne({ email });
    if (!exists) {
      await User.create({
        name: "Admin",
        email,
        password: process.env.ADMIN_PASSWORD || "Admin@12345",
        role: "admin",
      });
      console.log(`Admin user bana: ${email}`);
    } else {
      console.log(`Admin pehle se hai: ${email}`);
    }
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Seed fail hua:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
