import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, Heart, User, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const { user } = useAuth();

  const tabs = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/categories", label: "Categories", icon: LayoutGrid },
    { to: "/wishlist", label: "Wishlist", icon: Heart },
    user
      ? { to: "/profile", label: "Profile", icon: User }
      : { to: "/login", label: "Login", icon: LogIn },
  ];

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-slate-200 bg-white px-3 pb-3 pt-2 md:hidden"
    >
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-h-12 min-w-16 flex-col items-center gap-0.5 text-[11px] ${
              isActive
                ? "font-bold text-blue-700"
                : "font-semibold text-slate-600"
            }`
          }
        >
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
