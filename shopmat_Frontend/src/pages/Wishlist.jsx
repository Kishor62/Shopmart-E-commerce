import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { useCart } from "../context/CartContext";

const inr = (n) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);
  const { addToCart } = useCart();

  return (
    <section className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="mb-1 text-sm font-bold uppercase tracking-wider text-indigo-600">
          Saved Items
        </p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
          My Wishlist
        </h1>
        {items.length > 0 && (
          <p className="mt-2 text-slate-500">
            {items.length} item{items.length > 1 ? "s" : ""} saved
          </p>
        )}
      </div>

      {/* Empty State */}
      {!items.length ? (
        <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-slate-50">
            <Heart className="text-slate-300" size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-slate-500">
            Save items you like and find them here later.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => {
            const imgSrc = p.image || p.thumbnail || p.images?.[0] || "";
            const name = p.title || p.name || "Product";
            const rating = p.rating?.rate ?? p.rating ?? 0;
            const ratingCount = p.rating?.count ?? p.ratingCount ?? 0;
            const price = p.finalPrice ?? p.price ?? 0;
            const id = p.id || p._id;

            return (
              <div
                key={id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* Image + Delete button */}
                <div className="relative bg-slate-50">
                  <Link to={`/product/${id}`} className="block p-5">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={name}
                        className="h-48 w-full object-contain transition duration-300 group-hover:scale-105 md:h-52"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-slate-400 md:h-52">
                        No Image
                      </div>
                    )}
                  </Link>

                  {/* Single Delete Button */}
                  <button
                    onClick={() => dispatch(removeFromWishlist(id))}
                    className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-black/5 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <Link to={`/product/${id}`}>
                    <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-bold leading-snug text-slate-900 transition hover:text-blue-600">
                      {name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {(rating > 0 || ratingCount > 0) && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-700">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                        {Number(rating).toFixed(1)}
                      </span>
                      {ratingCount > 0 && (
                        <span className="text-xs text-slate-500">
                          ({ratingCount})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {p.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {p.description}
                    </p>
                  )}

                  {/* Price */}
                  <p className="mt-3 text-xl font-black text-slate-900">
                    {inr(price)}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() =>
                      addToCart({
                        id,
                        name,
                        price,
                        image: imgSrc,
                        quantity: 1,
                      })
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
