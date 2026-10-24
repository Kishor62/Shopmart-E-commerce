import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadBuffer, deleteImage } from "../config/cloudinary.js";

const SORTS = {
  "price-low": { price: 1 },
  "price-high": { price: -1 },
  rating: { "rating.rate": -1 },
  name: { title: 1 },
  newest: { createdAt: -1 },
};

// multipart form mein nested fields JSON string ban kar aate hain
const parseJSONFields = (body) => {
  const data = { ...body };
  ["colors", "options", "specs", "images"].forEach((key) => {
    if (typeof data[key] === "string") {
      try {
        data[key] = JSON.parse(data[key]);
      } catch {
        throw new ApiError(400, `${key} valid JSON hona chahiye`);
      }
    }
  });
  return data;
};

// Allowed fields hi update hote hain
const pick = (data) => {
  const fields = [
    "title", "description", "price", "originalPrice", "category", "brand",
    "colors", "optionsLabel", "options", "specs", "stock", "isNew", "featured",
  ];
  return Object.fromEntries(fields.filter((f) => data[f] !== undefined).map((f) => [f, data[f]]));
};

// GET /api/products?q=&category=&sort=&minPrice=&maxPrice=&page=&limit=
export const getProducts = asyncHandler(async (req, res) => {
  const { q, category, sort, minPrice, maxPrice, featured } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

  const filter = {};
  if (q) {
    // regex special characters escape karte hain
    const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
      { category: { $regex: safe, $options: "i" } },
    ];
  }
  if (category && category !== "all") filter.category = category.toLowerCase();
  if (featured === "true") filter.featured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(SORTS[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  });
});

// GET /api/products/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({
    success: true,
    categories: categories.map((c) => ({ name: c._id, count: c.count })),
  });
});

// GET /api/products/:id  (product details page)
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product nahi mila");
  res.json({ success: true, product });
});

// POST /api/products  (admin)  multipart: images (max 3) ya body.images = [url, ...]
export const createProduct = asyncHandler(async (req, res) => {
  const data = parseJSONFields(req.body);
  const doc = pick(data);

  doc.images = Array.isArray(data.images) ? data.images : [];
  doc.imagePublicIds = [];

  for (const file of req.files || []) {
    const { url, publicId } = await uploadBuffer(file.buffer);
    doc.images.push(url);
    doc.imagePublicIds.push(publicId);
  }

  const product = await Product.create(doc);
  res.status(201).json({ success: true, product });
});

// PUT /api/products/:id  (admin)
// Nayi images upload karoge to purani 3 images replace ho jati hain
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select("+imagePublicIds");
  if (!product) throw new ApiError(404, "Product nahi mila");

  const data = parseJSONFields(req.body);
  Object.assign(product, pick(data));

  if (req.files?.length) {
    await Promise.all((product.imagePublicIds || []).map(deleteImage));
    product.images = [];
    product.imagePublicIds = [];
    for (const file of req.files) {
      const { url, publicId } = await uploadBuffer(file.buffer);
      product.images.push(url);
      product.imagePublicIds.push(publicId);
    }
  } else if (Array.isArray(data.images)) {
    product.images = data.images;
  }

  await product.save();
  res.json({ success: true, product });
});

// DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select("+imagePublicIds");
  if (!product) throw new ApiError(404, "Product nahi mila");

  await Promise.all((product.imagePublicIds || []).map(deleteImage));
  await product.deleteOne();
  res.json({ success: true, message: "Product delete ho gaya" });
});
