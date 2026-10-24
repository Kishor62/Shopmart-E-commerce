import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Package,
} from "lucide-react";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  // Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-28 h-28 bg-white rounded-full shadow-xl shadow-slate-200/60 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag
              className="w-12 h-12 text-slate-300"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-500 mb-8 text-[15px]">
            Looks like you haven’t added anything yet.
          </p>
          <Link  to="/products" className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-2xl transition-all duration-300 shadow-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {items.length} {items.length === 1 ? "item" : "items"} in your
                cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-5">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl bg-slate-50"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-[16px] leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Line Total */}
                      <p className="text-lg font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Package size={20} className="text-slate-400" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[15px]">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-[15px]">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 group shadow-lg shadow-slate-900/20">
                Proceed to Checkout
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <p className="text-center text-xs text-slate-400 mt-5">
                Secure payment • Easy returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
