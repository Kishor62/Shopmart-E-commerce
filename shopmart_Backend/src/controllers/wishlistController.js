import User from "../models/User.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ success: true, wishlist: user.wishlist });
});

// POST /api/wishlist/:productId
export const addToWishlist = asyncHandler(async (req, res) => {
  const exists = await Product.exists({ _id: req.params.productId });
  if (!exists) throw new ApiError(404, "Product nahi mila");

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { wishlist: req.params.productId },
  });

  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(201).json({ success: true, wishlist: user.wishlist });
});

// DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: req.params.productId },
  });

  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ success: true, wishlist: user.wishlist });
});
