import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const getRazorpay = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new ApiError(503, "Razorpay configure nahi hai (.env mein keys daalo)");
  }
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
};

const loadOwnOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order nahi mila");
  if (String(order.user) !== String(userId)) throw new ApiError(403, "Ye order aapka nahi hai");
  return order;
};

// POST /api/payment/create-order   Body: { orderId }
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const order = await loadOwnOrder(req.body.orderId, req.user._id);
  if (order.isPaid) throw new ApiError(400, "Ye order pehle se paid hai");
  if (order.paymentMethod !== "RAZORPAY") {
    throw new ApiError(400, "Is order ka payment method Razorpay nahi hai");
  }

  const rp = await getRazorpay().orders.create({
    amount: Math.round(order.totalPrice * 100), // paise mein
    currency: "INR",
    receipt: String(order._id),
  });

  order.paymentResult = { ...order.paymentResult, razorpayOrderId: rp.id };
  await order.save();

  res.json({
    success: true,
    razorpayOrderId: rp.id,
    amount: rp.amount,
    currency: rp.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// POST /api/payment/verify
// Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Payment details adhoori hain");
  }

  const order = await loadOwnOrder(orderId, req.user._id);
  if (order.paymentResult?.razorpayOrderId !== razorpay_order_id) {
    throw new ApiError(400, "Razorpay order id match nahi hui");
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
  if (!valid) throw new ApiError(400, "Payment signature invalid hai");

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = "confirmed";
  order.paymentResult = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  };
  await order.save();

  res.json({ success: true, order });
});
