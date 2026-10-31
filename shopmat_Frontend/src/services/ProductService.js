const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Common API request handler
const apiRequest = async (endpoint, options = {}) => {
  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Server se connect nahi ho paya. Backend chal raha hai?");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body.message || `API Error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};

// Backend product -> purane (FakeStore jaisa) shape, taaki purane pages na tutein
//   price  = discount ke baad ki price (rupees, ab ×83 NAHI karna)
//   mrp    = original price
//   image  = thumbnail
//   rating = { rate, count }
const normalize = (p) => ({
  ...p,
  mrp: p.price,
  price: p.finalPrice ?? p.price,
  image: p.thumbnail,
  rating: { rate: p.rating ?? 0, count: p.ratingCount ?? 0 },
});

// Get all products (saare pages jod kar ek array)
export const getAllProducts = async (signal) => {
  const limit = 100;
  const first = await apiRequest(`/products?limit=${limit}&page=1`, { signal });
  let products = first.products;

  for (let page = 2; page <= (first.pages || 1); page++) {
    const next = await apiRequest(`/products?limit=${limit}&page=${page}`, {
      signal,
    });
    products = products.concat(next.products);
  }
  return products.map(normalize);
};

// Get single product by ID
export const getProductById = async (id, signal) => {
  if (!id) throw new Error("Product ID is required");

  const data = await apiRequest(`/products/${encodeURIComponent(id)}`, {
    signal,
  });
  return normalize(data.product);
};

// Get product + related products
export const getProductWithRelated = async (id, signal) => {
  if (!id) throw new Error("Product ID is required");

  const data = await apiRequest(`/products/${encodeURIComponent(id)}`, {
    signal,
  });
  return {
    product: normalize(data.product),
    related: (data.related || []).map(normalize),
  };
};

// Get all categories -> ["mobiles", "fashion", ...]  (slug strings, purane jaisa)
export const getAllCategories = async (signal) => {
  const cats = await apiRequest("/products/categories", { signal });
  return cats.map((c) => c.slug);
};

// Categories with name + icon -> [{ name, slug, icon }]
export const getCategoryList = async (signal) => {
  return apiRequest("/products/categories", { signal });
};

// Get products by category (slug)
export const getProductsByCategory = async (category, signal) => {
  if (!category) {
    throw new Error("Category is required");
  }

  const data = await apiRequest(
    `/products/category/${encodeURIComponent(category)}?limit=100`,
    { signal },
  );
  return data.products.map(normalize);
};

// Search products (ab server par search hoti hai)
export const searchProducts = async (query, signal) => {
  const term = query.trim();
  if (!term) return getAllProducts(signal);

  const data = await apiRequest(
    `/products/search?q=${encodeURIComponent(term)}&limit=100`,
    { signal },
  );
  return data.products.map(normalize);
};

// Filter and sort products on the client (pehle jaisa hi)
export const filterProducts = (
  products,
  { category = "all", query = "", sort = "default" } = {},
) => {
  let result = [...products];

  if (category !== "all") {
    result = result.filter((product) => product.category === category);
  }

  if (query.trim()) {
    const term = query.trim().toLowerCase();

    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term),
    );
  }

  switch (sort) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      result.sort((a, b) => b.rating.rate - a.rating.rate);
      break;

    case "name":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;

    default:
      break;
  }

  return result;
};
