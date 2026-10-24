import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title zaroori hai"], trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: [true, "Price zaroori hai"], min: 0 }, // INR
    originalPrice: { type: Number, min: 0 },
    category: {
      type: String,
      required: [true, "Category zaroori hai"],
      lowercase: true,
      trim: true,
      index: true,
    },
    brand: { type: String, trim: true },

    // Product details page ki 3-image gallery: URLs (max 3)
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 3,
        message: "Maximum 3 images allowed hain",
      },
    },
    // Cloudinary delete ke liye
    imagePublicIds: { type: [String], default: [], select: false },

    colors: [{ name: String, hex: String }],
    optionsLabel: { type: String, default: "Storage" },
    options: [{ label: String, price: Number }],
    specs: { type: Map, of: String, default: {} },

    stock: { type: Number, default: 0, min: 0 },
    rating: {
      rate: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    isNew: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

productSchema.index({ title: "text", description: "text", category: "text" });

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.image = ret.images?.[0] || null; // purane frontend code ke liye
    ret.discount =
      ret.originalPrice && ret.originalPrice > ret.price
        ? Math.round(((ret.originalPrice - ret.price) / ret.originalPrice) * 100)
        : 0;
    if (ret.specs instanceof Map) ret.specs = Object.fromEntries(ret.specs);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Product", productSchema);
