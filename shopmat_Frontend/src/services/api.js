const API_URL = "https://dummyjson.com";

export async function getProducts({ limit = 100, skip = 0 } = {}) {
  const res = await fetch(`${API_URL}/products?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Products load nahi ho sake.");
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Product nahi mila.");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/products/categories`);
  if (!res.ok) throw new Error("Categories load nahi ho sake.");
  return res.json();
}

export async function searchProducts(query) {
  const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed.");
  return res.json();
}