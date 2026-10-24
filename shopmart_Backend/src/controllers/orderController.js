import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const FREE_SHIPPING_ABOVE = 500;
const SHIPPING_FEE = 40;

// POST /api/orders
// Body: { items: [{ productId, quantity }], shippingAddress, paymentMethod }
// Price hamesha DB se liya jata hai, client ke bheje price par bharosa nahi
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = "COD" } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Cart khaali hai");
  }
  if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
    throw new ApiError(400, "Payment method galat hai");
  }

  const ids = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const orderItems = items.map(({ productId, quantity }) => {
    const product = byId.get(String(productId));
    if (!product) throw new ApiError(404, `Product nahi mila: ${productId}`);

    const qty = Math.floor(Number(quantity));
    if (!qty || qty < 1) throw new ApiError(400, `${product.title} ki quantity galat hai`);
    if (product.stock < qty) {
      throw new ApiError(400, `${product.title} ka stock kam hai (bacha: ${product.stock})`);
    }

    return {
      product: product._id,
      title: product.title,
      image: product.images?.[0],
      price: product.price,
      quantity: qty,
    };
  });

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
  });

  // Stock kam karo
  await Promise.all(
    orderItems.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: -i.quantity } })
    )
  );

  res.status(201).json({ success: true, order });
});

// GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// GET /api/orders/:id  (apna order, ya admin)
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) throw new ApiError(404, "Order nahi mila");

  const ownerId = order.user._id ? String(order.user._id) : String(order.user);
  if (ownerId !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "Ye order aapka nahi hai");
  }
  res.json({ success: true, order });
});

// PUT /api/orders/:id/cancel  (apna order, sirf shipped hone se pehle)
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order nahi mila");
  if (String(order.user) !== String(req.user._id)) {
    throw new ApiError(403, "Ye order aapka nahi hai");
  }
  if (!["pending", "confirmed"].includes(order.status)) {
    throw new ApiError(400, "Ye order ab cancel nahi ho sakta");
  }

  order.status = "cancelled";
  await order.save();

  // Stock wapas
  await Promise.all(
    order.items.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } })
    )
  );

  res.json({ success: true, order });
});

// GET /api/orders  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) throw new ApiError(400, "Status galat hai");

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order nahi mila");

  order.status = status;
  if (status === "delivered") {
    order.deliveredAt = new Date();
    if (order.paymentMethod === "COD") {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }
  await order.save();
  res.json({ success: true, order });
});
