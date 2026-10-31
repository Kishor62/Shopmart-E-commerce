import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/escapeRegex.js";

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { rating: -1, ratingCount: -1 },
  discount: { discountPercentage: -1 },
};

// Shared paginated query. Response shape is also DummyJSON-friendly
// ({ products, total, skip, limit }) so the React Categories page works unchanged.
async function paginate(filter, { sort = "newest", page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter).sort(SORTS[sort]).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  return {
    success: true,
    products,
    total,
    skip,
    limit,
    page,
    pages: Math.ceil(total / limit),
  };
}

const searchFilter = (q) => {
  const rx = new RegExp(escapeRegex(q), "i");
  return { $or: [{ title: rx }, { brand: rx }, { category: rx }, { tags: rx }] };
};

// GET /api/products
export async function listProducts(req, res) {
  const { q, category, brand, minPrice, maxPrice, inStock, sort, page, limit } = req.validatedQuery;

  const filter = { isActive: true };
  if (q) Object.assign(filter, searchFilter(q));
  if (category) filter.category = category;
  if (brand) filter.brand = new RegExp(`^${escapeRegex(brand)}$`, "i");
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }
  if (inStock === "true") filter.stock = { $gt: 0 };

  res.json(await paginate(filter, { sort, page, limit }));
}

// GET /api/products/search?q=
export async function searchProducts(req, res) {
  const { q, page, limit } = req.validatedQuery;
  res.json(await paginate({ isActive: true, ...searchFilter(q) }, { page, limit }));
}

// GET /api/products/categories  -> [{ slug, name }]   (same shape as DummyJSON)
export async function listCategories(_req, res) {
  const categories = await Category.find().sort({ name: 1 }).select("name slug icon image -_id");
  res.json(categories);
}

// GET /api/products/category/:slug
export async function productsByCategory(req, res) {
  const { page, limit, sort } = req.validatedQuery ?? {};
  res.json(
    await paginate(
      { isActive: true, category: req.params.slug },
      { page: page ?? 1, limit: limit ?? 20, sort: sort ?? "newest" }
    )
  );
}

// GET /api/products/:id
export async function getProduct(req, res) {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) throw new AppError("Product not found", 404);

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .sort({ rating: -1 })
    .limit(8);

  res.json({ success: true, product, related });
}

// ---------- Admin ----------
export async function createProduct(req, res) {
  if (!(await Category.exists({ slug: req.body.category }))) {
    throw new AppError(`Category "${req.body.category}" does not exist`, 400);
  }
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
}

export async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError("Product not found", 404);
  res.json({ success: true, product });
}

// Soft delete so old orders keep working
export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) throw new AppError("Product not found", 404);
  res.json({ success: true, message: "Product removed" });
}

export async function createCategory(req, res) {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
}
