const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Ek jagah se sab requests: error message backend se lega
async function request(path, fallbackMessage) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { credentials: "include" });
  } catch {
    throw new Error("Server se connect nahi ho paya. Backend chal raha hai?");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || fallbackMessage);
  }
  return res.json();
}

// Returns { products, total, skip, limit } (DummyJSON jaisa hi shape)
export async function getProducts({
  limit = 100,
  skip = 0,
  category,
  sort,
} = {}) {
  const page = Math.floor(skip / limit) + 1; // backend page se kaam karta hai
  const params = new URLSearchParams({ limit, page });
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort); // newest | price_asc | price_desc | rating | discount
  return request(`/products?${params}`, "Products load nahi ho sake.");
}

// Returns sirf product object (DummyJSON jaisa)
export async function getProduct(id) {
  const data = await request(`/products/${id}`, "Product nahi mila.");
  return data.product;
}
export const getProductById = getProduct; // purane naam ke liye

// Product + related products dono chahiye to
export async function getProductWithRelated(id) {
  const data = await request(`/products/${id}`, "Product nahi mila.");
  return { product: data.product, related: data.related || [] };
}

// Returns [{ name, slug, icon }]
export async function getCategories() {
  return request("/products/categories", "Categories load nahi ho sake.");
}

// Returns { products, total, ... }
export async function searchProducts(query) {
  return request(
    `/products/search?q=${encodeURIComponent(query)}`,
    "Search failed.",
  );
}

export async function getProductsByCategory(slug, { limit = 50 } = {}) {
  return request(
    `/products/category/${encodeURIComponent(slug)}?limit=${limit}`,
    "Products load nahi ho sake.",
  );
}

// Step 1: Send OTP
export async function requestPasswordReset(email) {
  return request("/auth/forgot-password", "Could not send OTP", {
    email,
  });
}

// Step 2: Verify OTP
export async function verifyPasswordOtp(email, otp) {
  return request("/auth/verify-otp", "Invalid OTP. Try again.", {
    email,
    otp,
  });
}

// Step 3: Reset password
export async function resetPassword(email, resetToken, newPassword) {
  return request("/auth/reset-password", "Could not reset password", {
    email,
    resetToken,
    newPassword,
  });
}
