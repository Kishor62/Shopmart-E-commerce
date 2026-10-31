import { Order } from "../models/Order.js";
import { AppError } from "../utils/AppError.js";
import { createOrderFromCart, restoreStock } from "../services/orderService.js";

// POST /api/orders
export async function createOrder(req, res) {
  const { items, shippingAddress, paymentMethod } = req.body;
  const order = await createOrderFromCart({
    userId: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
  });
  res.status(201).json({
    success: true,
    order,
    // For razorpay, frontend next calls POST /api/payment/create-order { orderId }
    nextStep: paymentMethod === "razorpay" ? "payment" : "done",
  });
}

// GET /api/orders/mine
export async function myOrders(req, res) {
  const { page, limit } = req.validatedQuery;
  const filter = { user: req.user._id };
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
}

// GET /api/orders/:id
export async function getOrder(req, res) {
  const filter = { _id: req.params.id };
  if (req.user.role !== "admin") filter.user = req.user._id;
  const order = await Order.findOne(filter);
  if (!order) throw new AppError("Order not found", 404);
  res.json({ success: true, order });
}

// PATCH /api/orders/:id/cancel
export async function cancelOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw new AppError("Order not found", 404);
  if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
    throw new AppError(`Order is already ${order.orderStatus}`, 400);
  }

  order.orderStatus = "cancelled";
  if (order.paymentStatus === "paid") {
    order.paymentStatus = "refunded"; // actual refund: do it from Razorpay dashboard / refund API
  } else if (order.paymentStatus === "pending") {
    order.paymentStatus = "failed";
  }
  await order.save();
  await restoreStock(order._id);

  res.json({ success: true, order });
}

// ---------- Admin ----------
export async function allOrders(req, res) {
  const { page, limit } = req.validatedQuery;
  const [orders, total] = await Promise.all([
    Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(),
  ]);
  res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
}

export async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  if (order.orderStatus === "cancelled") throw new AppError("Order is cancelled", 400);

  order.orderStatus = req.body.orderStatus;
  if (order.orderStatus === "delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "paid"; // COD is collected on delivery
  }
  await order.save();
  if (order.orderStatus === "cancelled") await restoreStock(order._id);

  res.json({ success: true, order });
}
