import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Builds an order from cart items. Prices ALWAYS come from the database,
 * never from the client. Stock is reserved atomically per product.
 */
export async function createOrderFromCart({ userId, items, shippingAddress, paymentMethod }) {
  // Merge duplicate product lines
  const qtyById = new Map();
  for (const { productId, quantity } of items) {
    qtyById.set(productId, (qtyById.get(productId) || 0) + quantity);
  }

  const products = await Product.find({ _id: { $in: [...qtyById.keys()] }, isActive: true });
  if (products.length !== qtyById.size) {
    throw new AppError("Some products in your cart are no longer available", 400);
  }

  const lines = products.map((p) => {
    const quantity = qtyById.get(String(p._id));
    if (quantity > 10) throw new AppError(`Max 10 units allowed for "${p.title}"`, 400);
    return {
      product: p._id,
      title: p.title,
      thumbnail: p.thumbnail,
      price: p.finalPrice,
      quantity,
    };
  });

  // Reserve stock atomically (conditional decrement). Roll back on any failure.
  const reserved = [];
  try {
    for (const line of lines) {
      const res = await Product.updateOne(
        { _id: line.product, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity } }
      );
      if (res.modifiedCount !== 1) {
        throw new AppError(`"${line.title}" is out of stock or has fewer units left`, 409);
      }
      reserved.push(line);
    }

    const itemsTotal = round2(lines.reduce((s, l) => s + l.price * l.quantity, 0));
    const shippingFee = itemsTotal >= env.FREE_SHIPPING_ABOVE ? 0 : env.SHIPPING_FEE;

    return await Order.create({
      user: userId,
      items: lines,
      shippingAddress,
      itemsTotal,
      shippingFee,
      totalAmount: round2(itemsTotal + shippingFee),
      paymentMethod,
      orderStatus: paymentMethod === "cod" ? "confirmed" : "created",
    });
  } catch (err) {
    await Promise.all(
      reserved.map((l) => Product.updateOne({ _id: l.product }, { $inc: { stock: l.quantity } }))
    );
    throw err;
  }
}

// Put stock back (idempotent thanks to the stockRestored flag)
export async function restoreStock(orderId) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, stockRestored: false },
    { $set: { stockRestored: true } },
    { new: true }
  );
  if (!order) return;
  await Promise.all(
    order.items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } }))
  );
}

// Cancel unpaid online orders older than `minutes` and release their stock
export async function cancelStaleUnpaidOrders(minutes = 30) {
  const cutoff = new Date(Date.now() - minutes * 60 * 1000);
  const stale = await Order.find({
    paymentMethod: "razorpay",
    paymentStatus: "pending",
    orderStatus: "created",
    createdAt: { $lt: cutoff },
  }).select("_id");

  for (const { _id } of stale) {
    await Order.updateOne(
      { _id, paymentStatus: "pending" },
      { $set: { orderStatus: "cancelled", paymentStatus: "failed" } }
    );
    await restoreStock(_id);
  }
  return stale.length;
}
