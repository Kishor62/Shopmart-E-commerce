import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/ProductService";
import Banner from "./Banner";
import ProductGrid from "../components/ProductGrid";
import {
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  ChevronRight,
  Loader2,
} from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories
  // Links /products?category=... par hain (Products page yahi padhta hai).
  // Pehle /category/... tha, jiska koi route nahi tha, isliye 404 aata tha.
  const categories = [
    {
      name: "Electronics",
      icon: <Smartphone size={24} />,
      path: "/products?category=electronics",
    },
    {
      name: "Fashion",
      icon: <Shirt size={24} />,
      path: "/products?category=men%27s clothing",
    },
    {
      name: "Home",
      icon: <HomeIcon size={24} />,
      path: "/products?category=jewelery",
    },
    {
      name: "Beauty",
      icon: <Sparkles size={24} />,
      path: "/products?category=women%27s clothing",
    },
    {
      name: "Sports",
      icon: <Dumbbell size={24} />,
      path: "/products?category=electronics",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Best Selling = highest rated
  const bestSelling = [...products]
    .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
    .slice(0, 8);

  // New Arrivals = last 8 products
  const newArrivals = [...products].slice(-8).reverse();

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* ========== BANNER ========== */}
      <Banner />

      {/* ========== CATEGORIES ========== */}
      {/* Mobile: 5 chhote icons ek row mein | Laptop: cards ka grid */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2 lg:py-8">
        <div className="flex justify-between lg:grid lg:grid-cols-5 lg:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="flex w-[62px] flex-col items-center gap-2 lg:w-auto lg:flex-row lg:gap-3.5 lg:rounded-[20px] lg:border lg:border-slate-200 lg:bg-white lg:px-[18px] lg:py-4 lg:transition lg:hover:shadow-md"
            >
              <div className="grid h-14 w-14 place-items-center rounded-[18px] border border-slate-200 bg-white text-blue-600 lg:h-[52px] lg:w-[52px] lg:rounded-2xl lg:border-0 lg:bg-blue-50">
                {cat.icon}
              </div>
              <span className="whitespace-nowrap text-xs font-semibold text-slate-900 lg:text-[15px] lg:font-bold">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== BEST SELLING ========== */}
      <section className="max-w-7xl mx-auto px-4 py-5 lg:py-6">
        <div className="flex items-center justify-between mb-3.5 lg:mb-5">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 lg:text-[26px]">
            Best Selling Products
          </h2>
          <Link
            to="/products"
            className="text-blue-700 text-sm font-bold flex items-center gap-0.5 hover:underline lg:text-[15px]"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <ProductGrid products={bestSelling} />
      </section>

      {/* ========== NEW ARRIVALS ========== */}
      <section className="max-w-7xl mx-auto px-4 py-5 pb-12 lg:py-6">
        <div className="flex items-center justify-between mb-3.5 lg:mb-5">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 lg:text-[26px]">
            New Arrivals
          </h2>
          <Link
            to="/products?sort=newest"
            className="text-blue-700 text-sm font-bold flex items-center gap-0.5 hover:underline lg:text-[15px]"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <ProductGrid products={newArrivals} />
      </section>
    </div>
  );
};

export default Home;