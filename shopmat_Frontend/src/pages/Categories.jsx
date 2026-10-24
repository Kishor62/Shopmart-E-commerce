import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/ProductService";
import {
  Smartphone,
  Shirt,
  Sparkles,
  Gem,
  LayoutGrid,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";

// Fake Store API ki asli categories
const CATEGORY_META = {
  electronics: {
    name: "Electronics",
    icon: Smartphone,
  },
  "men's clothing": {
    name: "Men's Clothing",
    icon: Shirt,
  },
  "women's clothing": {
    name: "Women's Clothing",
    icon: Sparkles,
  },
  jewelery: {
    name: "Jewelery",
    icon: Gem,
  },
};

const FALLBACK_META = {
  name: null,
  icon: ShoppingBag,
};

// Modern full-bleed image card with dark gradient overlay
const CategoryCard = ({ to, name, count, image }) => (
  <Link
    to={to}
    className="group relative block h-64 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:h-72 lg:h-80"
  >
    {/* Background image */}
    {image ? (
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    ) : (
      <div className="absolute inset-0 bg-slate-200" />
    )}

    {/* Dark gradient overlay (bottom → transparent) */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

    {/* Content at bottom */}
    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
      <h3 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
        {name}
      </h3>
      <p className="mt-1 text-sm text-white/80">
        {count} {count === 1 ? "product" : "products"}
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300 transition-all group-hover:gap-2.5 group-hover:text-white">
        Shop collection
        <ArrowRight size={16} />
      </span>
    </div>
  </Link>
);

const Categories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await getAllProducts(controller.signal);
        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load categories");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  // Products se categories, count aur image nikalte hain
  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const entry = map.get(p.category) ?? {
        id: p.category,
        count: 0,
        image: p.image,
      };
      entry.count += 1;
      // Better image prefer karo agar pehle wala missing ho
      if (!entry.image && p.image) entry.image = p.image;
      map.set(p.category, entry);
    });
    return [...map.values()];
  }, [products]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="font-medium text-slate-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-8 text-center sm:px-6 lg:px-8 lg:pt-14 lg:pb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Explore Categories
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base lg:text-lg">
          Discover top-quality products curated for every part of your life.
        </p>
      </section>

      {/* Modern 2-column category cards */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-7">
          {/* All Products card */}
          <CategoryCard
            to="/products"
            name="All Products"
            count={products.length}
            image={products[0]?.image}
          />

          {categories.map((c) => {
            const meta = CATEGORY_META[c.id] ?? FALLBACK_META;
            return (
              <CategoryCard
                key={c.id}
                to={`/products?category=${encodeURIComponent(c.id)}`}
                name={meta.name ?? c.id}
                count={c.count}
                image={c.image}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Categories;