import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import { HomeSkeleton } from "./components/Skeleton";

// Lazy pages: har page ka code tabhi download hota hai jab user wahan jaye
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Categories = lazy(() => import("./pages/Categories"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/Auth/Forgotpass"));
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const Settings = lazy(() => import("./pages/Dashboard/Setting"));
const OrderHistory = lazy(() => import("./pages/Dashboard/OrderHistory"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));


// Page badalne par upar scroll kar deta hai
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          {/* flex-col: content kam ho toh bhi Footer neeche rehta hai */}
          <div className="flex min-h-screen flex-col bg-[#F6F7FB] font-sans text-slate-900">
            <Navbar />

            <main className="flex-1">
              {/* Page load hone tak skeleton dikhega */}
              <Suspense fallback={<HomeSkeleton />}>
                <Routes>
                  {/* ========== Public Routes ========== */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/all/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />

                  {/* ========== Protected Routes (Dashboard) ========== */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-history"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />


                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />

            {/* Mobile bottom tab bar + uske neeche content na chhupe, isliye jagah */}
            <BottomNav />
            <div className="h-20 md:hidden" />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}