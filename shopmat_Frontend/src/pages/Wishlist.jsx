import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);

  return (
    <section className="container-app py-10">
      <div className="mb-8">
        <p className="text-sm font-bold text-indigo-600">SAVED ITEMS</p>
        <h1 className="text-4xl font-black">My Wishlist</h1>
      </div>

      {!items.length ? (
        <div className="card p-14 text-center">
          <Heart className="mx-auto text-slate-300" size={50} />
          <h2 className="mt-4 text-xl font-bold">Wishlist is empty</h2>
          <Link to="/products" className="btn-primary mt-5 inline-flex">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => {
            const imgSrc = p.image || p.thumbnail || p.images?.[0] || "";
            const rating = p.rating?.rate ?? p.rating ?? 0;
            const ratingCount = p.rating?.count ?? 0;

            return (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image → ProductDetails page */}
                <Link
                  to={`/product/${p.id}`}
                  className="relative block bg-slate-50 p-5"
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={p.title || p.name || "Product"}
                      className="h-52 w-full object-contain transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </Link>

                {/* Floating delete – image ke upar, link se bahar */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(removeFromWishlist(p.id));
                  }}
                  className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-md backdrop-blur transition hover:bg-red-50 hover:text-red-600 hover:shadow-lg active:scale-95"
                  style={{ position: "relative", marginTop: "-3.25rem", marginLeft: "auto", marginRight: "0.75rem" }}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={17} />
                </button>

                <div className="relative p-4">
                  {/* Title → ProductDetails page */}
                  <Link to={`/products/${p.id}`}>
                    <h3 className="line-clamp-2 font-bold text-slate-900 transition hover:text-blue-700">
                      {p.title || p.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {(rating > 0 || ratingCount > 0) && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-1.5 py-0.5">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-sm font-bold text-amber-700">
                          {Number(rating).toFixed(1)}
                        </span>
                      </div>
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
                    ₹{Math.round((p.price || 0) * 83).toLocaleString("en-IN")}
                  </p>

                  {/* Buttons – click pe page nahi khulega */}
                  <div className="mt-4 flex gap-2.5">
                    <button
                      onClick={() => dispatch(addToCart(p))}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => dispatch(removeFromWishlist(p.id))}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}