import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], title, viewAllLink }) => {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <p className="text-sm text-slate-500">No products found</p>
      </div>
    );
  }

  return (
    <section className="mb-10">
      {/* Header */}
      {(title || viewAllLink) && (
        <div className="mb-3.5 flex items-center justify-between lg:mb-[18px]">
          {title && (
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 lg:text-[26px]">
              {title}
            </h2>
          )}

          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-0.5 text-sm font-bold text-blue-700 hover:underline lg:text-[15px]"
            >
              View All <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}

      {/* Grid: mobile 2 columns, laptop 4 columns */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
