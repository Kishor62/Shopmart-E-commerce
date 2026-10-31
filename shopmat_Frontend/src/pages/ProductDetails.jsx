import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductWithRelated } from "../services/api";
import { ProductDetailSkeleton } from "../components/Skeleton";
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

const FREE_SHIPPING_ABOVE = 499;
const MAX_QTY = 10;

const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQuantity(1);
    setActiveImg(0);

    getProductWithRelated(id)
      .then(({ product, related }) => {
        setProduct(product);
        setRelated(related || []);
      })
      .catch((err) => {
        setError(err.message || "Product not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-red-500">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl bg-blue-500 px-6 py-2.5 font-medium text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ---------- Derived values ----------
  const images = product.images?.length
    ? product.images
    : [product.thumbnail].filter(Boolean);
  const discount = product.discountPercentage || 0;
  const finalPrice =
    product.finalPrice ??
    Math.round(product.price * (1 - discount / 100) * 100) / 100;
  const hasDiscount = discount > 0;
  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const maxQty = Math.min(stock, MAX_QTY);
  const freeDelivery = finalPrice * quantity >= FREE_SHIPPING_ABOVE;

  const handleAddToCart = () => {
    addToCart({
      id: product.id || product._id,
      name: product.title,
      price: finalPrice,
      image: product.thumbnail || images[0],
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-semibold text-slate-800">Product Details</h1>
        <div className="w-10" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Breadcrumb (desktop) */}
        <nav className="mb-4 hidden text-sm text-slate-500 lg:block">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>{" "}
          /{" "}
          <Link
            to={`/products?category=${product.category}`}
            className="capitalize hover:text-blue-600"
          >
            {product.category.replace(/-/g, " ")}
          </Link>{" "}
          / <span className="text-slate-800">{product.title}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ========== IMAGES ========== */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-28">
              <div className="relative flex aspect-square items-center justify-center rounded-xl bg-slate-50">
                {hasDiscount && (
                  <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
                    {Math.round(discount)}% OFF
                  </span>
                )}
                <img
                  src={images[activeImg]}
                  alt={product.title}
                  className="h-full w-full object-contain p-4"
                />
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImg(i)}
                      aria-label={`Image ${i + 1}`}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 ${
                        i === activeImg
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========== PRODUCT INFO ========== */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                  {product.category.replace(/-/g, " ")}
                </span>
                {product.brand && (
                  <span className="text-sm font-semibold text-slate-500">
                    by {product.brand}
                  </span>
                )}
              </div>

              <h1 className="mb-3 text-2xl font-bold leading-snug text-slate-800">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="mb-5 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {product.rating || 0}
                </span>
                <span className="text-sm text-slate-500">
                  ({product.ratingCount || 0} ratings)
                </span>
              </div>

              {/* Price */}
              <div className="mb-1 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900">
                  {inr(finalPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      {inr(product.price)}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      You save {inr(product.price - finalPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="mb-5 text-sm text-slate-500">
                Inclusive of all taxes
              </p>

              {/* Stock */}
              <p
                className={`mb-3 text-sm font-semibold ${
                  outOfStock
                    ? "text-red-600"
                    : stock <= 10
                      ? "text-amber-600"
                      : "text-emerald-600"
                }`}
              >
                {outOfStock
                  ? "Out of stock"
                  : stock <= 10
                    ? `Hurry! Only ${stock} left`
                    : "In stock"}
              </p>

              {/* Delivery */}
              <div className="mb-6 flex items-center gap-2 text-sm text-green-600">
                <Truck size={16} />
                {freeDelivery
                  ? "Free delivery"
                  : `Free delivery on orders above ${inr(FREE_SHIPPING_ABOVE)}`}
              </div>

              {/* Quantity */}
              {!outOfStock && (
                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Quantity
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center text-lg font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(maxQty, q + 1))
                      }
                      disabled={quantity >= maxQty}
                      aria-label="Increase quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <Plus size={16} />
                    </button>
                    {quantity >= maxQty && (
                      <span className="text-xs text-slate-500">
                        Max {maxQty} per order
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="mb-6 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <ShoppingCart size={18} />
                  {added ? "Added ✓" : "Add to Cart"}
                </button>
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  disabled={outOfStock}
                  className="flex-1 rounded-xl bg-slate-900 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-600">
                <div className="flex flex-col items-center gap-1">
                  <Truck size={18} className="text-blue-500" />
                  Fast Delivery
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw size={18} className="text-blue-500" />7 Days Return
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={18} className="text-blue-500" />
                  Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-800">
            Product Description
          </h2>
          <p className="leading-relaxed text-slate-600">
            {product.description}
          </p>

          {product.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <Link
                  key={t}
                  to={`/products?search=${encodeURIComponent(t)}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                You may also like
              </h2>
              <Link
                to={`/products?category=${product.category}`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.slice(0, 8).map((p) => {
                const price = p.finalPrice ?? p.price;
                const discount = p.discountPercentage || 0;

                return (
                  <div
                    key={p.id || p._id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <span className="absolute left-2 top-2 z-10 rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                        {Math.round(discount)}% OFF
                      </span>
                    )}

                    {/* Wishlist heart */}
                    <button
                      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm transition hover:text-red-500"
                      aria-label="Add to wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </button>

                    {/* Image */}
                    <Link
                      to={`/product/${p.id || p._id}`}
                      className="relative block aspect-square overflow-hidden bg-slate-50 p-3"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-3 pt-2">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                        {p.category?.replace(/-/g, " ")}
                      </p>

                      <Link
                        to={`/product/${p.id || p._id}`}
                        className="mb-1 line-clamp-2 text-[13px] font-semibold leading-snug text-slate-800 hover:text-blue-600"
                      >
                        {p.title}
                      </Link>

                      {/* Rating */}
                      <div className="mb-2 flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < Math.round(p.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          ({p.ratingCount || 0})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-3 flex items-baseline gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {inr(price)}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            {inr(p.price)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            id: p.id || p._id,
                            name: p.title,
                            price: price,
                            image: p.thumbnail,
                            quantity: 1,
                          });
                        }}
                        className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[0.98]"
                      >
                        <ShoppingCart size={15} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
