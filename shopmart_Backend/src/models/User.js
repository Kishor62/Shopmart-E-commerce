import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name zaroori hai"], trim: true },
    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Valid email daalo"],
    },
    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: [6, "Password kam se kam 6 characters ka ho"],
      select: false,
    },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Reset token banata hai; DB mein sirf hash save hota hai
userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return token;
};

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpire;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
