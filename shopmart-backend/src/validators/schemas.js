import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

// ---------- Auth ----------
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .regex(/[A-Za-z]/, "Password needs a letter")
    .regex(/\d/, "Password needs a number"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit phone").optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

// ---------- Forgot password ----------
const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72)
  .regex(/[A-Za-z]/, "Password needs a letter")
  .regex(/\d/, "Password needs a number");

export const forgotPasswordBody = z.object({
  email: z.string().trim().toLowerCase().email(),
});
export const verifyOtpBody = z.object({
  email: z.string().trim().toLowerCase().email(),
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits"),
});
export const resetPasswordBody = z.object({
  email: z.string().trim().toLowerCase().email(),
  resetToken: z.string().regex(/^[a-f0-9]{64}$/i, "Invalid reset token"),
  newPassword: strongPassword,
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit phone").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(72)
    .regex(/[A-Za-z]/, "Password needs a letter")
    .regex(/\d/, "Password needs a number"),
});

export const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit phone"),
  line1: z.string().trim().min(3),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
});

// ---------- Products ----------
export const idParam = z.object({ id: objectId });
export const slugParam = z.object({ slug: z.string().trim().toLowerCase().min(1) });

export const listProductsQuery = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().toLowerCase().optional(),
  brand: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.enum(["true", "false"]).optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "rating", "discount"])
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const searchQuery = z.object({
  q: z.string().trim().min(1, "Search text required"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const productBody = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().optional(),
  brand: z.string().trim().optional(),
  category: z.string().trim().toLowerCase().min(1),
  price: z.number().min(0),
  discountPercentage: z.number().min(0).max(90).optional(),
  stock: z.number().int().min(0),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
export const productUpdateBody = productBody.partial();

export const categoryBody = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().toLowerCase().min(2),
  icon: z.string().optional(),
  image: z.string().url().optional(),
});

// ---------- Home page content (banners + cards) ----------
// link must be an internal path ("/products?tag=diwali") or an https URL (blocks javascript: links)
const safeLink = z.string().trim().regex(/^(\/|https?:\/\/)/, "Link must start with / or http(s)://");

export const homeItemBody = z.object({
  kind: z.enum(["slide", "card"]),
  title: z.string().trim().min(2).max(80),
  subtitle: z.string().trim().max(140).optional(),
  image: z.string().trim().url("Image must be a valid URL"),
  link: safeLink.default("/products"),
  badge: z.string().trim().max(20).optional(),
  order: z.number().int().min(0).max(999).default(0),
  isActive: z.boolean().default(true),
  startAt: z.coerce.date().nullable().optional(),
  endAt: z.coerce.date().nullable().optional(),
});
export const homeItemUpdateBody = homeItemBody.partial();

// ---------- Wishlist ----------
export const wishlistToggleBody = z.object({ productId: objectId });

// ---------- Orders ----------
export const createOrderBody = z.object({
  items: z
    .array(z.object({ productId: objectId, quantity: z.number().int().min(1).max(10) }))
    .min(1, "Cart is empty")
    .max(50),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["razorpay", "cod"]),
});

export const listOrdersQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const updateOrderStatusBody = z.object({
  orderStatus: z.enum(["confirmed", "shipped", "delivered", "cancelled"]),
});

// ---------- Payment ----------
export const createPaymentBody = z.object({ orderId: objectId });

export const verifyPaymentBody = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});
