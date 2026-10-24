import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Send,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                S
              </div>
              <div>
                <h2 className="text-xl font-bold">ShopMart</h2>
                <p className="text-xs text-blue-300">Smart Shopping, Better Living.</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              ShopMart is your one-stop destination for quality products at great prices.
              We make shopping simple, fast and reliable.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 relative inline-block">
              Shop
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/products" className="hover:text-blue-400 transition">All Products</Link></li>
              <li><Link to="/products?sort=bestsellers" className="hover:text-blue-400 transition">Best Sellers</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-blue-400 transition">New Arrivals</Link></li>
              <li><Link to="/categories" className="hover:text-blue-400 transition">Categories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-white mb-4 relative inline-block">
              Customer Service
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-blue-400 transition">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-blue-400 transition">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-white mb-4 relative inline-block">
              About
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition">Terms</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4 relative inline-block">
              Newsletter
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get updates on new arrivals, deals and exclusive offers.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30"
              >
                Subscribe
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© 2024 ShopMart. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="text-xs">Secure & Trusted Payments</span>
            <div className="flex items-center gap-2">
              <span className="bg-white text-blue-900 text-xs font-bold px-2 py-1 rounded">VISA</span>
              <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded">MC</span>
              <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded">UPI</span>
              <span className="bg-white text-blue-700 text-xs font-bold px-2 py-1 rounded">PayPal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs">Follow Us</span>
            <div className="flex gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-blue-400 transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;