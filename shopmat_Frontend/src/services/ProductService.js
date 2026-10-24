
const BASE_URL = "https://fakestoreapi.com";

// Common API request handler
const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

// Get all products
export const getAllProducts = async (signal) => {
  return apiRequest("/products", { signal });
};

// Get single product by ID
export const getProductById = async (id, signal) => {
  if (!id) throw new Error("Product ID is required");

  return apiRequest(`/products/${encodeURIComponent(id)}`, {
    signal,
  });
};

// Get all categories
export const getAllCategories = async (signal) => {
  return apiRequest("/products/categories", { signal });
};

// Get products by category
export const getProductsByCategory = async (category, signal) => {
  if (!category) {
    throw new Error("Category is required");
  }

  return apiRequest(
    `/products/category/${encodeURIComponent(category)}`,
    { signal }
  );
};

// Search products by title
export const searchProducts = async (query, signal) => {
  const products = await getAllProducts(signal);
  const searchTerm = query.trim().toLowerCase();

  if (!searchTerm) return products;

  return products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
};

// Filter and sort products on the client
export const filterProducts = (
  products,
  { category = "all", query = "", sort = "default" } = {}
) => {
  let result = [...products];

  if (category !== "all") {
    result = result.filter(
      (product) => product.category === category
    );
  }

  if (query.trim()) {
    const term = query.trim().toLowerCase();

    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
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
      result.sort(
        (a, b) => b.rating.rate - a.rating.rate
      );
      break;

    case "name":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;

    default:
      break;
  }

  return result;
};
