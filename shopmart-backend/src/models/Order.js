import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true }, // snapshot
    thumbnail: String, // snapshot
    price: { type: Number, required: true }, // final unit price snapshot
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    itemsTotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true }, // in rupees

    paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ["created", "confirmed", "shipped", "delivered", "cancelled"],
      default: "created",
      index: true,
    },
    payment: {
      razorpayOrderId: { type: String, index: true, sparse: true },
      razorpayPaymentId: String,
      razorpaySignature: String,
      paidAt: Date,
    },
    stockRestored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.payment) delete ret.payment.razorpaySignature;
    return ret;
  },
});

export const Order = mongoose.model("Order", orderSchema);
