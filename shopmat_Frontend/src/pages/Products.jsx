import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { SlidersHorizontal, X } from "lucide-react";
import { getAllProducts } from "../services/ProductService";
import Loader from "../components/Loader";

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [priceRange, setPriceRange] = useState(50000);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setAllProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // URL se category change hone pe update
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  // Filtering
  let filteredProducts = allProducts.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchPrice = p.price <= priceRange;
    return matchCategory && matchPrice;
  });

  // ========== SORTING ==========
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].reverse(); // ya createdAt se sort karo
  }
  // "featured" = default order

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const categories = [
    { id: "all", name: "All Products" },
    { id: "electronics", name: "Electronics" },
    { id: "jewelery", name: "Jewellery" },
    { id: "men's clothing", name: "Men's Clothing" },
    { id: "women's clothing", name: "Women's Clothing" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-semibold text-slate-800 mb-4">Categories</h3>
              <div className="space-y-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedCategory === cat.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-slate-800 mb-3">Price Range</h3>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-2">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={22} />
              </button>
            </div>

            <h4 className="font-semibold mb-3">Categories</h4>
            <div className="space-y-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${
                    selectedCategory === cat.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <h4 className="font-semibold mb-3">Price Range</h4>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              <span>₹0</span>
              <span>₹{priceRange.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Products;