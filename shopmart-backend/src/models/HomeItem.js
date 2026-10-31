import mongoose from "mongoose";

// One collection for everything the admin controls on the home page:
//   kind "slide" -> big banner slider image
//   kind "card"  -> small cards shown below the banner (Diwali, New launches, Offers...)
const homeItemSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["slide", "card"], required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    subtitle: { type: String, trim: true, maxlength: 140, default: "" },
    image: { type: String, required: true, trim: true }, // image URL (Cloudinary / S3 / any https URL)
    link: { type: String, trim: true, default: "/products" }, // where it opens on click
    badge: { type: String, trim: true, maxlength: 20, default: "" }, // e.g. "Live now", "New", "Sale"
    order: { type: Number, default: 0 }, // smaller number shows first
    isActive: { type: Boolean, default: true },
    startAt: { type: Date, default: null }, // optional: auto show from this date (e.g. Diwali start)
    endAt: { type: Date, default: null }, //   optional: auto hide after this date
  },
  { timestamps: true }
);

homeItemSchema.index({ kind: 1, isActive: 1, order: 1 });

homeItemSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const HomeItem = mongoose.model("HomeItem", homeItemSchema);
