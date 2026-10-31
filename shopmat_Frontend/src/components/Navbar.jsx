import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  LayoutGrid,
  Truck,
} from "lucide-react";

// Backend ke categories (slug) ke hisaab se
const categories = [
  { name: "All Products", path: "/products" },
  { name: "Mobiles", path: "/products?category=mobiles" },
  { name: "Fashion", path: "/products?category=fashion" },
  { name: "Electronics", path: "/products?category=electronics" },
  { name: "Appliances", path: "/products?category=appliances" },
  { name: "Smart Gadgets", path: "/products?category=smart-gadgets" },
  { name: "Home", path: "/products?category=home" },
  { name: "Beauty", path: "/products?category=beauty" },
  { name: "Grocery", path: "/products?category=grocery" },
];

const desktopLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function IconLink({ to, label, count = 0, children }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50 lg:h-12 lg:w-12"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function SearchBox({ search, setSearch, onSubmit, className = "" }) {
  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={`flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-1.5 text-slate-500 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 lg:h-12 ${className}`}
    >
      <Search size={20} aria-hidden="true" className="shrink-0" />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="h-9 shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 lg:h-10"
      >
        <span className="hidden sm:inline">Search</span>
        <Search size={18} className="sm:hidden" aria-label="Search" />
      </button>
    </form>
  );
}

// Hover (mouse) + focus (keyboard) dono par khulne wala dropdown
function Dropdown({ trigger, children, align = "left" }) {
  return (
    <div className="group relative">
      {trigger}
      <div
        className={`invisible absolute top-full z-50 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        <div className="min-w-[210px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

const menuItem =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700";

function Navbar() {
  const [search, setSearch] = useState("");

  const { totalItems = 0 } = useCart();
  const { user, logout } = useAuth();
  const wishCount = useSelector((s) => s.wishlist?.items?.length ?? 0);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-[15px] font-semibold transition ${
      isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      {/* ROW 1: Logo | Search | Wishlist, Cart, Account */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-8 lg:px-8 lg:py-4">
        <div className="shrink-0">
          <Logo showTagline />
        </div>

        {/* Desktop search: beech mein, bachi hui jagah leta hai */}
        <SearchBox
          search={search}
          setSearch={setSearch}
          onSubmit={handleSearch}
          className="hidden min-w-0 flex-1 md:flex lg:mx-auto lg:max-w-2xl"
        />

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-3">
          <IconLink to="/wishlist" label="Wishlist" count={wishCount}>
            <Heart size={22} />
          </IconLink>

          <IconLink
            to="/cart"
            label={`Cart, ${totalItems} items`}
            count={totalItems}
          >
            <ShoppingCart size={22} />
          </IconLink>

          {user ? (
            <div className="hidden md:block">
              <Dropdown
                align="right"
                trigger={
                  <button className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 transition hover:bg-slate-50 lg:h-12">
                    <User size={20} />
                    <span className="max-w-[110px] truncate text-sm font-semibold">
                      {user.fullName || user.name}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                }
              >
                <Link to="/profile" className={menuItem}>
                  <User size={16} /> My Profile
                </Link>
                <Link to="/orders" className={menuItem}>
                  <Package size={16} /> My Orders
                </Link>
                <Link to="/wishlist" className={menuItem}>
                  <Heart size={16} /> Wishlist
                </Link>
                <Link to="/settings" className={menuItem}>
                  <Settings size={16} /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${menuItem} text-red-600 hover:bg-red-50 hover:text-red-700`}
                >
                  <LogOut size={16} /> Logout
                </button>
              </Dropdown>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:px-4 lg:h-12"
            >
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* ROW 2 (desktop only): links + categories dropdown */}
      <div className="hidden border-t border-slate-100 md:block">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8"
        >
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[15px] font-bold text-blue-700">
                <LayoutGrid size={18} /> Shop by Category{" "}
                <ChevronDown size={16} />
              </button>
            }
          >
            {categories.map((c) => (
              <Link key={c.name} to={c.path} className={menuItem}>
                {c.name}
              </Link>
            ))}
          </Dropdown>

          {desktopLinks.map((l) => (
            <NavLink key={l.label} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}

          <span className="ml-auto hidden items-center gap-2 text-sm font-semibold text-emerald-700 lg:flex">
            <Truck size={18} /> Free delivery above ₹499
          </span>
        </nav>
      </div>

      {/* Mobile search: poori width, main bar ke neeche */}
      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <SearchBox
          search={search}
          setSearch={setSearch}
          onSubmit={handleSearch}
          className="w-full"
        />
      </div>
    </header>
  );
}

export default Navbar;
