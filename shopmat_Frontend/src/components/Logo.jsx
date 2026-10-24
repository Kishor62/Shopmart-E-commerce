import { Link } from "react-router-dom";

// Logo ka icon: gradient square + shopping bag + checkout tick
export function LogoMark({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id="shopmart-logo-grad"
          x1="4"
          y1="2"
          x2="36"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F7BFF" />
          <stop offset="1" stopColor="#3B2FE0" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="12" fill="url(#shopmart-logo-grad)" />
      {/* Halka shine */}
      <path
        d="M0 14C0 6.3 6.3 0 14 0h12c7.7 0 14 6.3 14 14v1C28 12 12 12 0 21V14z"
        fill="white"
        fillOpacity="0.12"
      />

      {/* Bag handle */}
      <path
        d="M16 15v-1.6a4 4 0 0 1 8 0V15"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Bag body */}
      <path
        d="M11.5 15.5h17l-1.3 12.1a2.2 2.2 0 0 1-2.2 2H15a2.2 2.2 0 0 1-2.2-2L11.5 15.5z"
        fill="white"
      />
      {/* Checkout tick */}
      <path
        d="M16.6 22.6l2.6 2.6 4.6-4.9"
        stroke="#3B4FEA"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Icon + naam. tone="dark" light background par, tone="light" dark background par
export default function Logo({ tone = "dark", showTagline = false, onClick }) {
  const isDark = tone === "dark";

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="ShopMart home"
      className="group flex shrink-0 items-center gap-2.5"
    >
      <LogoMark
        size={40}
        className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[21px] font-extrabold tracking-tight">
          <span className={isDark ? "text-slate-900" : "text-white"}>Shop</span>
          <span className="text-blue-600">Mart</span>
        </span>
        {showTagline && (
          <span
            className={`mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.18em] lg:block ${
              isDark ? "text-slate-500" : "text-blue-200"
            }`}
          >
          </span>
        )}
      </span>
    </Link>
  );
}
