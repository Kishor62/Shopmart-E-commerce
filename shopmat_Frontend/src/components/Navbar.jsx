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
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home,
  Package,
  Phone,
  Info,
  Settings,
  LayoutGrid,
} from "lucide-react";

const categories = [
  { name: "All Categories", path: "/products" },
  { name: "Electronics", path: "/products?category=electronics" },
  { name: "Men's Clothing", path: "/products?category=men%27s clothing" },
  { name: "Women's Clothing", path: "/products?category=women%27s clothing" },
  { name: "Jewelery", path: "/products?category=jewelery" },
];

const desktopLinks = [
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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
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
      setMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setCategoryOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      {/* Main bar – everything in ONE row on md+ */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8 lg:py-4">
        {/* Logo */}
        <div className="shrink-0">
          <Logo showTagline />
        </div>

        {/* Desktop nav links */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 text-[15px] font-semibold xl:flex"
        >
          {desktopLinks.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-700"
                  : "text-slate-600 transition hover:text-slate-900"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Search – takes remaining space, stays in middle */}
        <SearchBox
          search={search}
          setSearch={setSearch}
          onSubmit={handleSearch}
          className="hidden min-w-0 flex-1 md:flex"
        />

        {/* RIGHT SIDE – Wishlist, Cart, Login (never wraps) */}
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

          {/* Account / Login */}
          {user ? (
            <div className="hidden items-center gap-1.5 md:flex">
              <Link
                to="/profile"
                className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 transition hover:bg-slate-50 lg:h-12"
              >
                <User size={20} />
                <span className="max-w-[100px] truncate text-sm font-semibold">
                  {user.fullName || user.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="h-11 rounded-xl px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 lg:h-12"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 md:flex lg:h-12"
            >
              <User size={18} /> Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile search only – full width below main bar */}
      <div className="border-t border-slate-100 px-4 py-3 md:hidden">
        <SearchBox
          search={search}
          setSearch={setSearch}
          onSubmit={handleSearch}
          className="w-full"
        />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="max-h-[70vh] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              <Home size={18} /> Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              <Package size={18} /> Products
            </NavLink>

            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              aria-expanded={categoryOpen}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid size={18} /> Categories
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoryOpen && (
              <div className="ml-4 space-y-1 rounded-xl bg-slate-50 p-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    onClick={closeMobileMenu}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <NavLink
              to="/wishlist"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              <Heart size={18} /> Wishlist
              {wishCount > 0 && (
                <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                  {wishCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/cart"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              <ShoppingCart size={18} /> Cart
              {totalItems > 0 && (
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  <User size={18} /> {user.fullName || user.name}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-left font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 py-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <User size={18} /> Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
                >
                  Sign up
                </Link>
              </div>
            )}

            <NavLink
              to="/contact"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              <Phone size={18} /> Contact
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              <Info size={18} /> About
            </NavLink>

            <NavLink
              to="/settings"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              <Settings size={18} /> Settings
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
