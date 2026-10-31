import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { AppError } from "../utils/AppError.js";

export async function getWishlist(req, res) {
  const user = await User.findById(req.user._id).populate({
    path: "wishlist",
    match: { isActive: true },
  });
  res.json({ success: true, products: user.wishlist });
}

// POST /api/wishlist/toggle  { productId }  -> adds if missing, removes if present
export async function toggleWishlist(req, res) {
  const { productId } = req.body;
  if (!(await Product.exists({ _id: productId, isActive: true }))) {
    throw new AppError("Product not found", 404);
  }

  const has = req.user.wishlist.some((id) => String(id) === productId);
  await User.updateOne(
    { _id: req.user._id },
    has ? { $pull: { wishlist: productId } } : { $addToSet: { wishlist: productId } }
  );

  res.json({ success: true, wishlisted: !has });
}

export async function clearWishlist(req, res) {
  await User.updateOne({ _id: req.user._id }, { $set: { wishlist: [] } });
  res.json({ success: true, products: [] });
}
