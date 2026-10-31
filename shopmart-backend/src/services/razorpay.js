import Razorpay from "razorpay";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

let client;

export function getRazorpay() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new AppError("Online payments are not configured on the server", 503);
  }
  client ??= new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
  return client;
}

const safeEqual = (a, b) => {
  const x = Buffer.from(a || "");
  const y = Buffer.from(b || "");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

// Checkout signature: HMAC_SHA256(order_id|payment_id, key_secret)
export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

// Webhook signature: HMAC_SHA256(raw body, webhook_secret)
export function verifyWebhookSignature(rawBody, signature) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return safeEqual(expected, signature);
}
