import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as s from "../validators/schemas.js";
import * as auth from "../controllers/authController.js";
import * as products from "../controllers/productController.js";
import * as wishlist from "../controllers/wishlistController.js";
import * as orders from "../controllers/orderController.js";
import * as payment from "../controllers/paymentController.js";
import * as home from "../controllers/homeController.js";
import * as reset from "../controllers/passwordResetController.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = Router();

// ---------------- Auth ----------------
router.post("/auth/register", authLimiter, validate({ body: s.registerSchema }), auth.register);
router.post("/auth/login", authLimiter, validate({ body: s.loginSchema }), auth.login);
router.post("/auth/logout", auth.logout);
router.post("/auth/forgot-password", authLimiter, validate({ body: s.forgotPasswordBody }), reset.forgotPassword);
router.post("/auth/verify-otp", authLimiter, validate({ body: s.verifyOtpBody }), reset.verifyOtp);
router.post("/auth/reset-password", authLimiter, validate({ body: s.resetPasswordBody }), reset.resetPassword);
router.get("/auth/me", protect, auth.me);
router.patch("/auth/me", protect, validate({ body: s.updateProfileSchema }), auth.updateMe);
router.patch("/auth/change-password", protect, validate({ body: s.changePasswordSchema }), auth.changePassword);
router.post("/auth/addresses", protect, validate({ body: s.addressSchema }), auth.addAddress);
router.delete("/auth/addresses/:id", protect, validate({ params: s.idParam }), auth.deleteAddress);

// ---------------- Products (static paths BEFORE /:id) ----------------
router.get("/products", validate({ query: s.listProductsQuery }), products.listProducts);
router.get("/products/search", validate({ query: s.searchQuery }), products.searchProducts);
router.get("/products/categories", products.listCategories);
router.get(
  "/products/category/:slug",
  validate({ params: s.slugParam, query: s.listProductsQuery }),
  products.productsByCategory
);
router.get("/products/:id", validate({ params: s.idParam }), products.getProduct);

// Admin only
router.post("/products", protect, restrictTo("admin"), validate({ body: s.productBody }), products.createProduct);
router.patch(
  "/products/:id",
  protect,
  restrictTo("admin"),
  validate({ params: s.idParam, body: s.productUpdateBody }),
  products.updateProduct
);
router.delete("/products/:id", protect, restrictTo("admin"), validate({ params: s.idParam }), products.deleteProduct);

// ---------------- Categories ----------------
router.get("/categories", products.listCategories);
router.post("/categories", protect, restrictTo("admin"), validate({ body: s.categoryBody }), products.createCategory);

// ---------------- Home page content (banner slider + cards) ----------------
router.get("/home-content", home.getHomeContent); // public

router.get("/admin/home-items", protect, restrictTo("admin"), home.adminList);
router.post("/admin/home-items", protect, restrictTo("admin"), validate({ body: s.homeItemBody }), home.adminCreate);
router.patch(
  "/admin/home-items/:id",
  protect,
  restrictTo("admin"),
  validate({ params: s.idParam, body: s.homeItemUpdateBody }),
  home.adminUpdate
);
router.delete("/admin/home-items/:id", protect, restrictTo("admin"), validate({ params: s.idParam }), home.adminDelete);

// ---------------- Wishlist ----------------
router.get("/wishlist", protect, wishlist.getWishlist);
router.post("/wishlist/toggle", protect, validate({ body: s.wishlistToggleBody }), wishlist.toggleWishlist);
router.delete("/wishlist", protect, wishlist.clearWishlist);

// ---------------- Orders ----------------
router.post("/orders", protect, validate({ body: s.createOrderBody }), orders.createOrder);
router.get("/orders/mine", protect, validate({ query: s.listOrdersQuery }), orders.myOrders);
router.get(
  "/orders",
  protect,
  restrictTo("admin"),
  validate({ query: s.listOrdersQuery }),
  orders.allOrders
);
router.get("/orders/:id", protect, validate({ params: s.idParam }), orders.getOrder);
router.patch("/orders/:id/cancel", protect, validate({ params: s.idParam }), orders.cancelOrder);
router.patch(
  "/orders/:id/status",
  protect,
  restrictTo("admin"),
  validate({ params: s.idParam, body: s.updateOrderStatusBody }),
  orders.updateOrderStatus
);

// ---------------- Payment (Razorpay) ----------------
router.post("/payment/create-order", protect, validate({ body: s.createPaymentBody }), payment.createPayment);
router.post("/payment/verify", protect, validate({ body: s.verifyPaymentBody }), payment.verifyPayment);
// NOTE: the webhook route is registered in app.js (needs raw body, no auth)

export default router;
