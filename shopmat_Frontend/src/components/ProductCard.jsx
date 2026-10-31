import { Heart, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../context/CartContext";
import { toggleWishlist } from "../redux/slices/wishlistSlice";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const dispatch = useDispatch();

  const inWishlist = useSelector((s) =>
    s.wishlist.items.some((i) => i.id === product.id),
  );

  const name = product.title ?? product.name;
  const rate = product.rating?.rate;
  const count = product.rating?.count;
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : product.discount || 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({ ...product, name }));
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_rgba(15,23,42,.06)] transition-shadow hover:shadow-lg lg:rounded-[22px]">
      {/* Image */}
      <div className="relative h-[150px] bg-[#EEF1F8] lg:h-[210px]">
        <Link to={`/product/${product.id}`} className="block h-full w-full p-4">
          <img
            src={product.image || product.thumbnail}
            alt={name}
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white lg:left-3 lg:top-3 lg:text-xs">
            -{discount}%
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          className="absolute right-1 top-1 grid h-11 w-11 place-items-center"
        >
          <span
            className={`grid h-[34px] w-[34px] place-items-center rounded-full shadow ring-1 ring-black/5 transition active:scale-90 ${
              inWishlist ? "bg-red-500 text-white" : "bg-white text-slate-900"
            }`}
          >
            <Heart size={18} className={inWishlist ? "fill-white" : ""} />
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-3.5 pt-3 lg:gap-2 lg:px-[18px] lg:pb-[18px] lg:pt-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
          {product.category}
        </span>

        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[36px] text-sm font-bold leading-snug text-slate-900 hover:text-blue-700 lg:min-h-[42px] lg:text-base">
            {name}
          </h3>
        </Link>

        {rate != null && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 lg:text-[13px]">
            <span className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700">
              <Star size={11} className="fill-current" />
              {rate}
            </span>
            {count != null && <span>({count.toLocaleString("en-IN")})</span>}
          </div>
        )}

        {/* Price upar + Button neeche */}
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-extrabold tracking-tight text-slate-900 lg:text-[22px]">
              {inr(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through lg:text-[13px]">
                {inr(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart({ ...product, name })}
            aria-label={`Add ${name} to cart`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Plus size={18} strokeWidth={2.4} />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;