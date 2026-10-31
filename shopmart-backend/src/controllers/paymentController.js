import { Order } from "../models/Order.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { getRazorpay, verifyCheckoutSignature, verifyWebhookSignature } from "../services/razorpay.js";

// POST /api/payment/create-order  { orderId }
// Creates a Razorpay order for an existing (unpaid) Shopmart order.
export async function createPayment(req, res) {
  const order = await Order.findOne({ _id: req.body.orderId, user: req.user._id });
  if (!order) throw new AppError("Order not found", 404);
  if (order.paymentMethod !== "razorpay") throw new AppError("This order is not an online payment order", 400);
  if (order.paymentStatus === "paid") throw new AppError("Order is already paid", 400);
  if (order.orderStatus === "cancelled") throw new AppError("Order is cancelled", 400);

  const rzp = getRazorpay();
  const rzpOrder = await rzp.orders.create({
    amount: Math.round(order.totalAmount * 100), // rupees -> paise (server-side amount only)
    currency: "INR",
    receipt: String(order._id),
    notes: { orderId: String(order._id), userId: String(req.user._id) },
  });

  order.payment.razorpayOrderId = rzpOrder.id;
  await order.save();

  res.json({
    success: true,
    key: env.RAZORPAY_KEY_ID, // public key id is safe for the frontend
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    orderId: order._id,
    prefill: { name: req.user.name, email: req.user.email, contact: req.user.phone },
  });
}

async function markPaid(order, { paymentId, signature }) {
  if (order.paymentStatus === "paid") return order; // idempotent
  order.paymentStatus = "paid";
  if (order.orderStatus === "created") order.orderStatus = "confirmed";
  order.payment.razorpayPaymentId = paymentId;
  if (signature) order.payment.razorpaySignature = signature;
  order.payment.paidAt = new Date();
  return order.save();
}

// POST /api/payment/verify   (called by frontend from Razorpay `handler`)
export async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findOne({
    "payment.razorpayOrderId": razorpay_order_id,
    user: req.user._id,
  });
  if (!order) throw new AppError("Order not found", 404);

  const ok = verifyCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!ok) {
    throw new AppError("Payment verification failed", 400);
  }

  await markPaid(order, { paymentId: razorpay_payment_id, signature: razorpay_signature });
  res.json({ success: true, message: "Payment successful", order });
}

// POST /api/payment/webhook  (called by Razorpay servers; body is RAW, see app.js)
// Safety net in case the user closes the tab before /verify runs.
export async function razorpayWebhook(req, res) {
  const signature = req.headers["x-razorpay-signature"];
  if (!Buffer.isBuffer(req.body) || !verifyWebhookSignature(req.body, signature)) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const event = JSON.parse(req.body.toString("utf8"));
  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;

  if (razorpayOrderId) {
    const order = await Order.findOne({ "payment.razorpayOrderId": razorpayOrderId });
    if (order) {
      if (event.event === "payment.captured" || event.event === "order.paid") {
        await markPaid(order, { paymentId: payment.id });
      } else if (event.event === "payment.failed" && order.paymentStatus === "pending") {
        // keep order open so user can retry; stale-order job releases stock later
        order.payment.razorpayPaymentId = payment.id;
        await order.save();
      }
    }
  }

  res.json({ received: true }); // always 200 for valid signatures so Razorpay stops retrying
}
