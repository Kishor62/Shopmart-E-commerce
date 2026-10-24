import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star } from "lucide-react";

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">🛒</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">ShopMart</h2>
                <p className="text-xs text-blue-200 tracking-wider">SHOP MORE, SAVE MORE</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              Summer Sale <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
                is Live!
              </span>
            </h1>

            <p className="text-lg text-blue-100 mb-8 max-w-md mx-auto lg:mx-0">
              Up to <span className="font-bold text-yellow-300">50% Off</span> on Fashion, Electronics & More
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-full hover:bg-blue-50 transition shadow-lg shadow-blue-900/30"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/categories"
                className="flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition"
              >
                Explore Collection
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-cyan-300" />
                <span>Fast Delivery Across India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-cyan-300" />
                <span>Secure Payment 100% Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-cyan-300" />
                <span>Easy Returns Hassle Free</span>
              </div>
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="flex-1 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Floating Products Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Headphones */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-2 transition duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
                    alt="Headphones"
                    className="w-full h-32 object-contain"
                  />
                </div>

                {/* Smartwatch */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-2 transition duration-300 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
                    alt="Smartwatch"
                    className="w-full h-32 object-contain"
                  />
                </div>

                {/* Sneakers */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-2 transition duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop"
                    alt="Sneakers"
                    className="w-full h-32 object-contain"
                  />
                </div>

                {/* T-Shirt */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl transform hover:-translate-y-2 transition duration-300 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
                    alt="T-Shirt"
                    className="w-full h-32 object-contain"
                  />
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-blue-700 text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                Top Brands | Best Prices | Exclusive Deals
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;