import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/ProductService";
import Loader from "../components/Loader";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-500 font-medium text-lg mb-4">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Price convert USD → INR
  const priceInINR = Math.round(product.price * 83);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: priceInINR,
      image: product.image,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-semibold text-slate-800">Product Details</h1>
        <div className="flex items-center gap-2"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ========== IMAGE ========== */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="aspect-square flex items-center justify-center bg-slate-50 rounded-xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
          </div>

          {/* ========== PRODUCT INFO ========== */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Category Badge */}
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 capitalize">
                {product.category}
              </span>

              <h1 className="text-2xl font-bold text-slate-800 mb-3 leading-snug">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating?.rate || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {product.rating?.rate || 0}
                </span>
                <span className="text-sm text-slate-500">
                  ({product.rating?.count || 0} ratings)
                </span>
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-3xl font-bold text-slate-900">
                  ₹{priceInINR.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-5">
                Inclusive of all taxes
              </p>

              {/* Delivery */}
              <div className="flex items-center gap-2 text-sm text-green-600 mb-6">
                <Truck size={16} />
                Free delivery available
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-lg w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-600">
                <div className="flex flex-col items-center gap-1">
                  <Truck size={18} className="text-blue-500" />
                  Free Delivery
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
        <div className="mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg text-slate-800 mb-3">
              Product Description
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
