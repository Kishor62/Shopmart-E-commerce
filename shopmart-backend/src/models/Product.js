import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "" },
    brand: { type: String, trim: true, default: "" },
    category: { type: String, required: true, lowercase: true, trim: true, index: true }, // Category.slug
    price: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 90 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    thumbnail: { type: String, default: "" },
    images: [{ type: String }],
    tags: [{ type: String, lowercase: true, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", brand: "text", tags: "text" });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Final selling price after discount (virtual -> included in JSON)
productSchema.virtual("finalPrice").get(function () {
  return Math.round(this.price * (1 - (this.discountPercentage || 0) / 100) * 100) / 100;
});

productSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model("Product", productSchema);
